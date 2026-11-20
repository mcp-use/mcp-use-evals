# mcp-use SDK agentic eval — 2026-11-20

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-20T14-05-19` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m45s
- Median turns: 18
- Median tool calls: 22
- Median tokens in/out: 725790 / 8116
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API-shape discovery through installed declarations rather than documentation: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and repeatedly inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `mount-mcp.d.ts` to determine `fromOpenAPI`, `listen`, and `close` signatures. Client discovery also took several probes because the first search targeted `*.d.ts` and returned nothing (`find node_modules/@modelcontextprotocol/client -type f -name '*.d.ts'`), after which the agent discovered declarations were packaged as `index.d.mts` via `rg -n "StreamableHTTP" ... -g '*.{d.mts,d.cts,mjs,cjs}'`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed declarations and package inspection rather than docs: it ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`, and inspected the MCP client declarations under `node_modules/@modelcontextprotocol/sdk/dist/esm/client`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main discovery cost was reverse-engineering the installed packages rather than using docs: the agent repeatedly searched declarations with `rg -n "fromOpenAPI|streamable|MCPServer" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`, and then searched `node_modules/@modelcontextprotocol` for `StreamableHTTPClientTransport` and protocol constants.
