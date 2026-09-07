# mcp-use SDK agentic eval — 2026-09-07

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-07T14-08-11` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m55s
- Median turns: 20
- Median tool calls: 22
- Median tokens in/out: 609015 / 7936
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent had to discover the SDK shape from installed declarations because `npm view mcp-use@2.0.4 readme --json` returned `""`. It then grepped the package with `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`; this established details such as `listen(port)` returning the endpoint URL and the generated request body being a single `body` argument: “`The SDK’s OpenAPI adapter generates a single body tool argument for JSON request bodies`.” No skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery: the agent repeatedly inspected installed package internals, starting with `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use/README.md node_modules/mcp-use/dist`, then reading `node_modules/mcp-use/dist/openapi/types.d.ts`, and finally grepping minified implementation with `rg -n -C 2 "registerOpenAPITools" node_modules/mcp-use/dist/chunk-*.js`. This suggests the README quickstart did not directly surface the needed `fromOpenAPI` and generated-argument behavior; the excerpt it found instead showed manual tools: `const server = new MCPServer({` and `server.tool(`. The agent had to infer the generated request shape from implementation, concluding: `request bodies are supplied under body, while path/query parameters remain top-level`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main discovery cost was API-shape exploration in installed packages: the agent repeatedly grepped declarations for `"class MCPServer|fromOpenAPI|Streamable|streamable|listen\\("`, inspected `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, and `config.d.ts`, then separately searched the MCP client package for `"StreamableHTTPClientTransport"` and `"listTools\\(|callTool\\("`. This indicates the run leaned on `node_modules` typings rather than a skill file or fetched docs; the transcript explicitly says, `"I’ve confirmed its OpenAPI helper accepts a bundled object and supports tag filtering"` after those inspections.
