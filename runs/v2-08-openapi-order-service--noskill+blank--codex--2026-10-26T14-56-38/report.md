# mcp-use SDK agentic eval — 2026-10-26

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-26T14-56-38` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m19s
- Median turns: 25.5
- Median tool calls: 32
- Median tokens in/out: 1238250 / 10184
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or external docs, first running `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and `README.md`. It also inspected implementation internals with `rg -n "fromOpenAPI|async listen|listen\\(" node_modules/mcp-use/dist -g '*.js'`, suggesting API discovery required substantial node_modules spelunking.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection to discover the API shape, first running `rg -n "fromOpenAPI|StreamableHTTP|streamable" node_modules/mcp-use node_modules/@mcp-use`, then reading `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. This discovery had minor dead ends: one inspection command failed with `sed: can't read node_modules/mcp-use/dist/index-node.d.ts`, and client transport discovery required further searches for `StreamableHTTPClientTransport` and `listTools\(\)|callTool\(` in `node_modules/@modelcontextprotocol/client/dist/index.d.mts`.
