import { MCPServer } from "mcp-use";
import { z } from "zod";

interface DocPage {
  slug: string;
  title: string;
  body: string;
}

// Module-scope seed data: the server rebuilds its request handlers from the
// registry on every request, so shared read-only state must live here, not
// inside the MCPServer instance or a callback closure.
const pages: DocPage[] = [
  {
    slug: "getting-started",
    title: "Getting Started",
    body: "Install the CLI and run init to scaffold a new project.",
  },
  {
    slug: "authentication",
    title: "Authentication",
    body: "Requests must include a bearer token in the Authorization header.",
  },
  {
    slug: "deployment",
    title: "Deployment",
    body: "Deploy the server behind a reverse proxy that terminates TLS.",
  },
];

const pagesBySlug = new Map(pages.map((page) => [page.slug, page]));

function firstValue(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}

const server = new MCPServer({
  name: "docs-lookup-server",
  version: "1.0.0",
  description: "Golden solution for the read-only documentation lookup eval task",
});

server.resource(
  {
    name: "docs-index",
    uri: "docs://index",
    mimeType: "text/plain",
    description: "Lists all available documentation pages",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: pages
          .map((page) => `${page.slug}: ${page.title}`)
          .join("\n"),
      },
    ],
  })
);

server.resourceTemplate(
  {
    name: "docs-page",
    uriTemplate: "docs://{slug}",
    mimeType: "text/plain",
    description: "Reads a single documentation page by slug",
    complete: {
      slug: pages.map((page) => page.slug),
    },
  },
  async (uri, { slug }) => {
    const page = pagesBySlug.get(firstValue(slug));
    if (!page) {
      return {
        contents: [{ uri: uri.href, mimeType: "text/plain", text: "Page not found" }],
      };
    }
    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "text/plain",
          text: `${page.title}\n${page.body}`,
        },
      ],
    };
  }
);

server.tool(
  {
    name: "search_docs",
    description:
      "Search documentation page titles and bodies for a query string and return matching slugs and titles",
    inputSchema: z.object({
      query: z.string().describe("Case-insensitive substring to search for"),
    }),
  },
  async ({ query }) => {
    const needle = query.toLowerCase();
    const matches = pages.filter(
      (page) =>
        page.title.toLowerCase().includes(needle) ||
        page.body.toLowerCase().includes(needle)
    );
    if (matches.length === 0) {
      return {
        content: [{ type: "text", text: "No documentation pages matched that query." }],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: matches.map((page) => `${page.slug}: ${page.title}`).join("\n"),
        },
      ],
    };
  }
);

// listen() resolves the port from an explicit arg, then PORT env, then
// config.port, then defaults to 3000; serves streamable-HTTP MCP at /mcp.
await server.listen();
