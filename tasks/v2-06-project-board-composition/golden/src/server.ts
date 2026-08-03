import { MCPServer, text } from "mcp-use";
import { z } from "zod";

interface Issue {
  title: string;
  assignee: string | null;
  resolved: boolean;
}

// Module-scope shared state: the MCPServer rebuilds a fresh SDK server per
// request, so anything mutated by a tool and later read by a resource (or a
// later tool call) must live up here, not inside the MCPServer instance.
const issues = new Map<string, Issue>();
let nextId = 1;

function openCount(): number {
  let n = 0;
  for (const issue of issues.values()) if (!issue.resolved) n++;
  return n;
}

function resolvedCount(): number {
  let n = 0;
  for (const issue of issues.values()) if (issue.resolved) n++;
  return n;
}

function describeIssue(id: string, issue: Issue): string {
  const status = issue.resolved ? "resolved" : "open";
  const assignee = issue.assignee ?? "unassigned";
  return `Issue ${id}: "${issue.title}" — assignee: ${assignee} — status: ${status}`;
}

const server = new MCPServer({
  name: "project-board-composition-server",
  version: "1.0.0",
  description:
    "Golden solution: a project-issue tracker with tools plus live board/issue resources",
});

server.tool(
  {
    name: "create_issue",
    description: "Create a new issue with a title; returns the new issue's id",
    inputSchema: z.object({
      title: z.string().describe("Issue title"),
    }),
  },
  async ({ title }) => {
    const id = String(nextId++);
    issues.set(id, { title, assignee: null, resolved: false });
    return text(
      `Created issue ${id}: "${title}" (open issues: ${openCount()})`
    );
  }
);

server.tool(
  {
    name: "assign_issue",
    description: "Assign an existing issue to a person by id",
    inputSchema: z.object({
      id: z.string().describe("Issue id"),
      assignee: z.string().describe("Person to assign the issue to"),
    }),
  },
  async ({ id, assignee }) => {
    const issue = issues.get(id);
    if (!issue) return text(`Issue "${id}" not found.`);
    issue.assignee = assignee;
    return text(`Assigned issue ${id} to ${assignee}.`);
  }
);

server.tool(
  {
    name: "resolve_issue",
    description: "Mark an existing issue as resolved by id",
    inputSchema: z.object({
      id: z.string().describe("Issue id"),
    }),
  },
  async ({ id }) => {
    const issue = issues.get(id);
    if (!issue) return text(`Issue "${id}" not found.`);
    issue.resolved = true;
    return text(
      `Issue ${id} is now resolved (open issues: ${openCount()}).`
    );
  }
);

server.resource(
  {
    name: "board-summary",
    uri: "board://summary",
    mimeType: "text/plain",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        mimeType: "text/plain",
        text: `Open issues: ${openCount()}\nResolved issues: ${resolvedCount()}\nTotal issues: ${issues.size}`,
      },
    ],
  })
);

server.resourceTemplate(
  {
    name: "issue",
    uriTemplate: "issue://{id}",
  },
  async (uri, { id }) => {
    const issueId = Array.isArray(id) ? id[0] : id;
    const issue = issues.get(issueId);
    const body = issue
      ? describeIssue(issueId, issue)
      : `Issue "${issueId}" not found.`;
    return {
      contents: [{ uri: uri.href, mimeType: "text/plain", text: body }],
    };
  }
);

// listen() resolves the port from PORT env (default 3000)
await server.listen();
