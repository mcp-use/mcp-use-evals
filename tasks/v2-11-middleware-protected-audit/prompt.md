Build a TypeScript MCP server with protocol middleware that protects a destructive tool and produces a deterministic audit trail.

Register exactly two tools: `read_record`, which requires an `id`, and `delete_record`, which requires an `id` and accepts an optional `approvalCode`. Protect deletion with `server.use("mcp:tools/call", ...)`. A delete call must be rejected with an error containing `approval required` unless its approval code is exactly `APPROVE-DELETE`; allowed calls must continue through `next()`. Keep this authorization policy in middleware, not in the delete tool handler.

Append every attempted tool call to a module-scoped audit log with a monotonically increasing sequence number, tool name, and outcome (`allowed` or `denied`). Expose the log through a listed text resource at `audit://events`, one event per line in the stable form `<seq>|<tool>|<outcome>`.

Build directly in the current working directory. Use `mcp-use` version `2.0.4`, TypeScript, and typed Zod schemas. Install every required dependency. The entry must be `src/server.ts` or `index.ts`; the server must expose streamable HTTP at `/mcp`, listen on `PORT` (default 3000), typecheck with `npx tsc --noEmit`, and run with `npx tsx <entry-file>`.

When finished, verify a read, a denied delete, an approved delete, and the resulting ordered audit resource.
