# mcp-use SDK agentic eval — 2026-08-26

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-26T14-17-01` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m59s
- Median turns: 13.5
- Median tool calls: 23
- Median tokens in/out: 729680.5 / 7497.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than docs or a skill file: it ran `rg -n "fromOpenAPI|streamable|StreamableHTTP|create.*Server|MCPServer" node_modules/mcp-use` and read `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. No fetched docs URL or mcp-use skill file appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main wrong turn was an unsupported import path: the first typecheck failed with `Cannot find module 'mcp-use/openapi'`, after which the agent inspected package exports via `JSON.stringify(require('./node_modules/mcp-use/package.json').exports, null, 2)` and corrected the import. It also hit a TypeScript narrowing papercut where `Number.isInteger(body.quantity)` did not narrow `unknown`, producing `Type 'unknown' is not assignable to type 'number'`; the final source uses `quantity: body.quantity as number`.
