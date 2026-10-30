# mcp-use SDK agentic eval — 2026-10-30

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-30T14-06-41` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m08s
- Median turns: 17
- Median tool calls: 25
- Median tokens in/out: 912530 / 7867
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API-shape discovery through installed declarations and bundles: the agent repeatedly searched `node_modules` with `rg -n -C 4 "fromOpenAPI|streamable"` and inspected `node_modules/mcp-use/dist/server.d.ts`, then read minified runtime code via `indexOf('static fromOpenAPI')`. Client verification required further digging through `@modelcontextprotocol/client`, including `find node_modules/@modelcontextprotocol/client` and searches for `StreamableHTTPClientTransport`; the first search returned nothing (`"output":""`), suggesting the package’s generated declaration layout was not easy to navigate.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than docs or a skill file, searching `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable|MCPServer"` and reading `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`. It also inspected the MCP client declarations via `rg -n "StreamableHTTPClientTransport|class Client|callTool|listTools"` to build the lifecycle test.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied on installed SDK declarations and README rather than external docs, explicitly inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, and `node_modules/mcp-use/README.md` after grepping for `"fromOpenAPI|streamable|Streamable|http"`. This discovery work established the listener API from the declaration `listen(port?: number | undefined, options?: ListenOptions)` and the returned `"HTTP URL of the bound MCP endpoint."`
