Build a TypeScript MCP server that implements a stateless, multi-round deployment approval flow.

Register exactly one tool named `request_deploy`. It accepts an `environment` string. On the initial call it must return an `input_required` result containing exactly one form request keyed `deployment-approval`. The message must be `Approve production deployment?` when the environment is `production`. Its requested schema must require a boolean `approve` field and may accept an optional string `note`.

On a retry, inspect `ctx.inputResponses`. An accepted response with `approve: true` must return structured content containing `environment`, `deployed: true`, and the supplied note. A decline, cancellation, or accepted response with `approve: false` must be terminal and return an error result; it must not request input again.

Use the raw `input_required` helpers exported by `mcp-use`: `inputRequired`, `inputResponse`, and/or `acceptedContent`. Do not call `ctx.elicit` and do not perform deployment side effects before validated approval.

Build directly in the current working directory. Use `mcp-use` version `2.0.4`, typed Zod schemas, and a TypeScript entry at `src/server.ts` or `index.ts`. The server must expose streamable HTTP at `/mcp`, listen on the port supplied through `PORT` (default 3000), typecheck with `npx tsc --noEmit`, and run with `npx tsx <entry-file>`. Install every required dependency.

When finished, verify both an accepted approval with a note and a declined approval. A decline must produce one terminal error result, not another input request.
