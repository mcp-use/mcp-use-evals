# mcp-use SDK agentic eval — 2026-08-10

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-10T14-27-04` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m30s
- Median turns: 18.5
- Median tool calls: 25.5
- Median tokens in/out: 929409 / 8573
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main SDK discovery path was direct inspection of the installed package: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|createHTTP|MCPServer" node_modules/mcp-use`, then opened `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, the package `README.md`, and bundled implementation files such as `dist/chunk-Y26DNVWA.js`. This worked, but indicates API-shape discovery required grepping declarations and minified internals rather than relying on an immediately known public import surface.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or external docs, reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/openapi/types.d.ts`, and even searching bundled implementation code for `"function createInputBindings"` and `"fromOpenAPI"`. This suggests API-shape discovery required several deep `node_modules` probes before implementation.
