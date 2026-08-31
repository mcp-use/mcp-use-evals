# mcp-use SDK agentic eval — 2026-08-31

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-31T14-08-16` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m51s
- Median turns: 22
- Median tool calls: 24
- Median tokens in/out: 754033 / 7684
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API discovery rather than implementation: the agent first queried npm metadata with `npm view mcp-use@2.0.4`, then inspected package contents using `npm pack mcp-use@2.0.4 --dry-run`, and after installation read `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. It still had to grep bundled implementation code—`rg -n --text -C 3 "fromOpenAPI|registerOpenAPITools|operationId" node_modules/mcp-use/dist/chunk-Y26DNVWA.js`—to determine generated argument shape, eventually concluding that “`generated request bodies use a body input field, while path/query parameters remain id and include`.” This suggests the OpenAPI tool-input mapping was not readily discoverable from the public declarations alone.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was SDK API discovery through installed package internals rather than concise documentation: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, `mount-mcp.d.ts`, and `config.d.ts`. It then searched generated implementation bundles with `rg -n "static fromOpenAPI|fromOpenAPI\\(" node_modules/mcp-use/dist/index-node.js`, whose output was a large minified chunk, suggesting the exported API shape was not immediately discoverable from a simple example. Client verification required similar spelunking in `node_modules/@modelcontextprotocol/client/dist/index.d.mts`; an initial search failed with exit code 1 after looking only for `*.d.ts`, while the package actually exposed declarations such as `index.d.mts`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed package declarations rather than external docs or a skill file, first running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then inspecting `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`. It similarly discovered the verification client API through `rg -n "StreamableHTTP.*Transport|class Client|listTools|callTool" node_modules/@modelcontextprotocol/client/dist`, indicating some API-shape discovery friction but no failed implementation attempt.
