# mcp-use SDK agentic eval — 2026-09-16

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-16T14-08-13` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m38s
- Median turns: 22
- Median tool calls: 27
- Median tokens in/out: 953545 / 8606
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The run leaned heavily on installed package internals rather than a skill file or fetched documentation: it searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable|createHttp|listen"` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the minified implementation containing `registerOpenAPITools`. It also explored the MCP client API through package metadata and declarations, including `npm view @modelcontextprotocol/client@2.0.0 exports --json` and searches for `StreamableHTTPClientTransport`, suggesting some discovery friction around how to perform lifecycle verification.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK and client API by inspecting installed package internals: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts` and `dist/openapi/types.d.ts`, and inspected minified implementation with `rg -n "registerOpenAPITools|requestBody|parameters" node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. It similarly searched `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for `StreamableHTTPClientTransport`, `listTools()`, and `callTool()`. No mcp-use skill file or fetched documentation URL appears; the only documentation consulted was the installed client README via `sed -n '1,240p' node_modules/@modelcontextprotocol/client/README.md`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery. The agent extensively grepped installed declarations and implementation rather than relying on a skill or fetched documentation: `rg -n "fromOpenAPI|Streamable|streamable|createHTTP|start" node_modules/mcp-use`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the bundled implementation containing `function registerOpenAPITools(server,options)`. This investigation established the generated request-body shape; the agent explicitly concluded, `The SDK’s OpenAPI generator uses a \`body\` tool argument for JSON request bodies`, which was then reflected in `scripts/verify-mcp.ts` as `arguments: { body: { sku: "green-tea", quantity: 2 } }`.
