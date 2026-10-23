# mcp-use SDK agentic eval — 2026-10-23

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-23T14-08-10` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 21
- Median tool calls: 28
- Median tokens in/out: 819584 / 9105
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API discovery through installed package internals rather than a concise documented example: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|connect" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`, then separately searched the client package for `StreamableHTTPClientTransport`, `Client`, `listTools`, and `callTool`. This exploration did establish important shapes, including that `listen()` returns the actual endpoint URL and that request bodies become a generated `body` argument, summarized as: `The SDK exposes an OpenAPI generator that maps a JSON request body to a generated \`body\` tool argument`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main time sink was API discovery through installed package internals: the agent ran `find node_modules/mcp-use`, searched for `"fromOpenAPI|streamable|Streamable"`, and opened `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`. It also had to inspect the MCP client’s bundled declarations after an initial search returned nothing (`"exitCode":0,"output":""`), eventually locating `StreamableHTTPClientTransport` in `node_modules/@modelcontextprotocol/client/dist/index.d.mts`. No skill file or external docs URL was used; the transcript only shows reliance on `node_modules` declarations and README.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery: the agent repeatedly inspected installed declarations and minified implementation, including `find node_modules/mcp-use`, `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts`, and searches for `"registerOpenAPITools|fromOpenAPI"`. No skill file or external docs URL was used; the transcript instead shows reliance on `node_modules/mcp-use/dist/openapi/types.d.ts`, `README.md`, package exports, and generated chunks.
