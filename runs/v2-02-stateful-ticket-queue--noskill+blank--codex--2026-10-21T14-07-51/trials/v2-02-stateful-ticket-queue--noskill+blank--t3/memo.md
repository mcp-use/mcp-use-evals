The agent had to discover the API locally rather than using a skill or fetched docs: it searched `node_modules/mcp-use/README.md` and declarations with `rg -n "streamable|Streamable|createMcpServer|McpServer|tool\\("`, then inspected `node_modules/mcp-use/dist/server.d.ts` to confirm `listen(port?: number ...)`. This worked, but required several exploratory commands before implementation.

The first typecheck failed because the generated TypeScript configuration omitted Node globals despite `@types/node` being installed: `Cannot find name 'process'. Do you need to install type definitions for node? ... add 'node' to the types field in your tsconfig.` The agent then modified `tsconfig.json` and reran the check successfully.

Verification was thorough but manually verbose: the agent constructed raw streamable-HTTP requests with repeated `curl ... -H 'MCP-Protocol-Version: 2025-03-26'` calls rather than using an SDK client or inspector. The endpoint’s SSE framing was visible as `event: message` / `data: {"result":...}`, so this approach worked but added command complexity.

A generic repository check was attempted in a blank non-git workspace and produced avoidable noise: `warning: Not a git repository. Use --no-index to compare two paths outside a working tree`, followed by the full `git diff` usage output.

Process cleanup also took two attempts because killing the npm wrapper did not stop its child: after `kill 483`, `pgrep` still showed `524 node node_modules/.bin/tsx src/server.ts`; the agent then separately ran `kill 524` and confirmed `verification server stopped`.