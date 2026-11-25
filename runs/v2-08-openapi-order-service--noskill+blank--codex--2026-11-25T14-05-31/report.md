# mcp-use SDK agentic eval — 2026-11-25

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-25T14-05-31` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m15s
- Median turns: 19
- Median tool calls: 28
- Median tokens in/out: 1132525 / 10178
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than external docs or a skill file, first running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and bundled implementation code via `rg -n "fromOpenAPI" node_modules/mcp-use/dist/*.js`. This worked, but indicates API-shape discovery friction around `fromOpenAPI()`, `listen()`, and the streamable HTTP endpoint.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent leaned heavily on installed package internals rather than external docs or a skill file, searching `node_modules/mcp-use/dist` for `"fromOpenAPI|class MCPServer|streamableHttp"` and reading `server.d.ts`, `openapi/types.d.ts`, and the README. Discovery was somewhat awkward because the implementation was bundled rather than available at the guessed path: `rg: node_modules/mcp-use/dist/server.js: IO error ... No such file or directory`, after which it had to inspect `index-node.js`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on inspecting installed SDK internals rather than docs, searching `node_modules/mcp-use` for `"fromOpenAPI|streamable|Streamable"` and opening `dist/openapi/types.d.ts`, `dist/server.d.ts`, and bundled implementation code around `"requestBody|query"`. That investigation correctly revealed the generated request-body shape, later confirmed by `tools/list` showing `"required":["body"]`.
