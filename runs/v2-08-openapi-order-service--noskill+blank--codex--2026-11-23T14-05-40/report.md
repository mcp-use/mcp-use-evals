# mcp-use SDK agentic eval — 2026-11-23

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-23T14-05-40` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 16
- Median tool calls: 21.5
- Median tokens in/out: 699986 / 7195.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than docs, first grepping declarations with `rg -n "fromOpenAPI|streamable|Streamable|listen" node_modules/mcp-use` and then inspecting generated implementation via `rg -n "function registerOpenAPITools|registerOpenAPITools" node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. This investigation established the non-obvious generated request shape: `the OpenAPI generator uses a single \`body\` tool argument for JSON request bodies`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals to discover the API shape, running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, and the minified `chunk-Y26DNVWA.js`; no skill file or fetched documentation appears in the transcript.
