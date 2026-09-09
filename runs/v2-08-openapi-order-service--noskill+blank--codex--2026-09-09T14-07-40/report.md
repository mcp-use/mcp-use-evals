# mcp-use SDK agentic eval — 2026-09-09

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-09T14-07-40` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m38s
- Median turns: 21.5
- Median tool calls: 22.5
- Median tokens in/out: 917086.5 / 8328
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than docs or a skill file, first running `rg -n "fromOpenAPI|Streamable|streamable" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. It also inspected bundled implementation code to infer generated argument shape, searching `fromOpenAPI|requestBody|body:` before concluding that the generator uses a `body` input.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery: the agent inspected `node_modules/mcp-use/README.md`, then multiple declaration files including `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, and `node_modules/mcp-use/dist/index.d.ts`. It also grepped minified implementation code for request-body behavior with `rg -n "registerOpenAPITools|requestBody|body" node_modules/mcp-use/dist/chunk-*.js`, suggesting the generated tool argument shape was not immediately clear from public docs or types.
