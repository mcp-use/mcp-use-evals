# mcp-use SDK agentic eval — 2026-09-04

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-04T14-07-27` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m24s
- Median turns: 22
- Median tool calls: 29
- Median tokens in/out: 1038299.5 / 9507.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than docs or a skill file, searching `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable|MCPServer"` and later inspecting `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for `"listTools\\(|callTool\\("`. This discovery path was fairly extensive, including reading bundled implementation via `"registerOpenAPITools"` and `"requestBody"` searches.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed package internals rather than external docs or a skill file, grepping `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable"` and reading `node_modules/mcp-use/dist/server.d.ts` plus `openapi/types.d.ts` to discover `listen()` and OpenAPI API shapes.
