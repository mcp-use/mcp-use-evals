The main friction was API discovery: the agent repeatedly inspected installed declarations rather than using SDK docs, including `rg -n "fromOpenAPI|streamable|StreamableHTTP" node_modules/mcp-use`, `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts`, and searches in `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for `"listTools\\(|callTool\\("`. No mcp-use skill file or fetched docs URL appears in the transcript.

There was dependency churn around the MCP client: the first tree showed both `@modelcontextprotocol/sdk@1.32.2` and mcp-use’s `@modelcontextprotocol/client@2.0.0`, after which `package.json` was modified and reinstalling reported `removed 89 packages`. The final `package.json` instead directly pins `"@modelcontextprotocol/client": "2.0.0"`.

The first typecheck failed on application typing rather than SDK usage: `src/server.ts(100,11): error TS2322: Type 'unknown' is not assignable to type 'number'.` A source edit fixed it before the successful `npx tsc --noEmit && npm run verify`.

Verification took an extra iteration. The first successful run checked the missing read only, ending after `tools/call getOrder ERROR order ord-1001 not found`; then `src/verify.ts` was modified and the next run additionally exercised `tools/call cancelOrder ERROR order ord-1001 not found`.

The final review also hit an avoidable workspace assumption: `git status --short` failed with `fatal: not a git repository (or any of the parent directories): .git`, requiring another command with `git diff --check 2>/dev/null || true`.