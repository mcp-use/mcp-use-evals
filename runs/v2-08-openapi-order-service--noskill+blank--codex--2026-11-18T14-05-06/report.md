# mcp-use SDK agentic eval — 2026-11-18

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-18T14-05-06` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m08s
- Median turns: 21
- Median tool calls: 23
- Median tokens in/out: 861100 / 8139
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main friction was API discovery through installed package internals rather than documentation: the agent searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable"` and then inspected `node_modules/mcp-use/dist/server.d.ts` and `dist/openapi/types.d.ts`. It likewise had to probe the MCP client package repeatedly; the first search returned no output, after which it used `find node_modules/@modelcontextprotocol/client -maxdepth 4` and searched generated `.d.mts` files for `StreamableHTTPClientTransport`, `listTools`, and `callTool`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery through installed package internals rather than guidance: the agent searched `rg -n "fromOpenAPI|StreamableHTTP" node_modules/mcp-use node_modules/@modelcontextprotocol`, inspected `node_modules/mcp-use/dist/server.d.ts` and `dist/openapi/types.d.ts`, then grepped bundled JavaScript for `"fromOpenAPI|requestBody|body"` to determine that request bodies become a `body` argument. Client verification required another sequence of searches, including `find node_modules/@modelcontextprotocol/client`, printing package exports, and locating `"class Client|listTools\\(|callTool\\(|class StreamableHTTPClientTransport"` in declarations. No skill file or fetched documentation URL appears; the resources used were `npm view mcp-use@2.0.4` and `node_modules` declarations/runtime exports.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery: the agent repeatedly grepped installed declarations and implementation—`rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then `rg -n "function fromOpenAPI|fromOpenAPI" node_modules/mcp-use/dist/*.js`—before determining that generated JSON request bodies use a `body` argument: `The SDK is installed and its OpenAPI generator uses a \`body\` tool argument`. It also inspected the MCP client package across several commands, including `rg -n "StreamableHTTPClientTransport|class Client" node_modules/@modelcontextprotocol/client`, suggesting the client verification API was not immediately obvious from the package surface. No skill file or fetched documentation URL appears in the transcript; the run leaned on `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, minified `chunk-*.js`, and the client’s `index.d.mts`.
