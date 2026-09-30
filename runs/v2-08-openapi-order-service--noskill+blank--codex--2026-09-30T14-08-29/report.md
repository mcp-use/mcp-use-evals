# mcp-use SDK agentic eval — 2026-09-30

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-30T14-08-29` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m07s
- Median turns: 18
- Median tool calls: 23
- Median tokens in/out: 730538.5 / 7092.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than documentation, searching `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable"` and then inspecting `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts` for the API shape. It also searched the MCP client package for a verification transport—`rg -n "class StreamableHTTPClientTransport"`—but found nothing and switched to raw `curl` JSON-RPC requests.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed package declarations and implementation discovery rather than a skill file or fetched documentation: it searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable|HTTP"` and inspected `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and `README.md`. It also checked package metadata first via `npm view mcp-use@2.0.4 version dependencies peerDependencies dist.tarball`.
