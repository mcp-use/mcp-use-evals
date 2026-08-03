Build an MCP (Model Context Protocol) server using the mcp-use TypeScript SDK (the `mcp-use` npm package): a read-only documentation lookup service.

Seed the server with (at least) these three documentation pages, hardcoded in memory (no database, no files, no network calls):

- slug `getting-started`, title `Getting Started`, body containing the exact phrase `Install the CLI and run init to scaffold a new project.`
- slug `authentication`, title `Authentication`, body containing the exact phrase `Requests must include a bearer token in the Authorization header.`
- slug `deployment`, title `Deployment`, body containing the exact phrase `Deploy the server behind a reverse proxy that terminates TLS.`

Build the project directly in your current working directory — do not create a new subdirectory for it.

Requirements:

1. Expose a resource at the URI `docs://index` listing the available documentation pages: the response must include every seeded page's title.
2. Expose a parameterized resource readable at `docs://<slug>` for each seeded slug (e.g. `docs://getting-started`) that returns that page's full body text. Reading an unseeded slug must not crash the server or throw an error — it must return a result containing the exact phrase `not found`.
3. Expose a tool named `search_docs` with a single string parameter `query`. It must search across page titles and bodies (case-insensitive substring match) and return the slugs (and titles) of matching pages. When no page matches, it must return a response that does not contain any seeded page's slug.
4. This is a read-only server: no tool may modify, add, or remove any documentation page. The tool only reads and searches the existing pages.
5. All tool input parameters must be validated with a typed schema.
6. The server must serve MCP over streamable HTTP, listening on the port given by the `PORT` environment variable (defaulting to 3000 when unset).
7. The server entry file must be `src/server.ts` or `index.ts`.
8. The project must be TypeScript: it must typecheck cleanly with `npx tsc --noEmit` and be runnable with `npx tsx <entry-file>`.
9. Install any dependencies you need so the project runs as-is.

When you are done, verify your work: typecheck the project, start the server, list the available resources, read the index and at least one page resource, and confirm `search_docs` returns the right page for a term that appears in only one page's body and returns nothing for a term that appears in none of them.
