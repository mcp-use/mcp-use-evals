# mcp-use SDK agentic eval — 2026-10-19

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-19T14-08-15` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m37s
- Median turns: 20
- Median tool calls: 22
- Median tokens in/out: 711508 / 7433
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main friction was API discovery: without a skill or fetched docs, the agent inspected installed declarations and bundles via `rg -n "fromOpenAPI|streamable" node_modules/mcp-use` and `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts`. It also searched the client package repeatedly—`rg -n "StreamableHTTPClientTransport|transport"` followed by `find node_modules/@modelcontextprotocol/client/dist` and `rg -n "StreamableHTTP"`—to determine the verification-client API. The SDK’s generated request-body shape was a notable surprise: the agent explicitly concluded, `The SDK’s OpenAPI generator uses a nested \`body\` argument for JSON request bodies`, and verified creation with `arguments: { body: { sku: "green-tea", quantity: 2 } }`; this behavior was learned from package internals rather than obvious documentation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed type declarations rather than a skill file or fetched docs, repeatedly inspecting SDK internals with commands such as `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`, `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, and later searching `@modelcontextprotocol/client` for `StreamableHTTPClientTransport`, `listTools()`, and `callTool()`. This discovery work consumed several calls before implementation, although the declarations did answer key behavior directly: `HTTP URL of the bound MCP endpoint` and port precedence `the argument, PORT, config.port, then 3000`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main discovery friction was API-shape lookup: the agent searched installed package internals with `rg -n "fromOpenAPI|Streamable|streamable|HTTP" node_modules/mcp-use` and then inspected `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, and generated JS. This established the non-obvious request-body convention: `"uses a \`body\` tool argument for JSON request bodies."` No skill file or fetched docs URL appears; the agent relied on `node_modules` declarations, README, and implementation code.
