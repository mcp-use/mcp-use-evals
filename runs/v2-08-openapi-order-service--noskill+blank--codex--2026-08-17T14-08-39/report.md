# mcp-use SDK agentic eval — 2026-08-17

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-17T14-08-39` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m22s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 927470 / 11398
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on package-local discovery rather than external docs, first grepping declarations and README with `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use`, then inspecting `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. API-shape discovery briefly went down a dead path because it assumed an unbundled runtime file: `rg: node_modules/mcp-use/dist/server.js: No such file or directory`; it then inspected the package exports and bundled `dist/index-node.js`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than external docs, first running `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/openapi/types.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/README.md`. It similarly explored the transitive MCP client API through `rg -n "StreamableHTTPClientTransport|class Client" node_modules/@modelcontextprotocol/client/dist`, adding several discovery calls before lifecycle verification.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent initially installed dependencies it did not need—`npm install mcp-use@2.0.4 express zod` plus `@types/express`—then reversed course with `npm uninstall express zod @types/express`, adding avoidable package churn.
