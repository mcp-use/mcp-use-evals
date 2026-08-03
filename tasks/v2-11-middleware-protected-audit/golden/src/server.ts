import { MCPServer } from "mcp-use";
import { z } from "zod";

interface AuditEvent { seq: number; tool: string; outcome: "allowed" | "denied" }
const audit: AuditEvent[] = [];
let sequence = 0;

const server = new MCPServer({ name: "middleware-protected-audit", version: "1.0.0" });

server.use("mcp:tools/call", async (ctx, next) => {
  const args = ctx.params.arguments ?? {};
  if (ctx.params.name === "delete_record" && args.approvalCode !== "APPROVE-DELETE") {
    audit.push({ seq: ++sequence, tool: ctx.params.name, outcome: "denied" });
    return { isError: true, content: [{ type: "text", text: "approval required" }] };
  }
  audit.push({ seq: ++sequence, tool: ctx.params.name, outcome: "allowed" });
  return next();
});

server.tool(
  { name: "read_record", inputSchema: z.object({ id: z.string() }) },
  async ({ id }) => ({ content: [{ type: "text", text: `Record ${id}: active` }] })
);

server.tool(
  { name: "delete_record", inputSchema: z.object({ id: z.string(), approvalCode: z.string().optional() }) },
  async ({ id }) => ({ content: [{ type: "text", text: `deleted ${id}` }] })
);

server.resource(
  { name: "audit-events", uri: "audit://events", mimeType: "text/plain" },
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "text/plain",
      text: audit.map((event) => `${event.seq}|${event.tool}|${event.outcome}`).join("\n"),
    }],
  })
);

await server.listen();
