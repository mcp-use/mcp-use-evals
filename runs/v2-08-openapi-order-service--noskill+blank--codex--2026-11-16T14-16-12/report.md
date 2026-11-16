# mcp-use SDK agentic eval — 2026-11-16

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-16T14-16-12` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m26s
- Median turns: 19
- Median tool calls: 23.5
- Median tokens in/out: 794639.5 / 7651
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than external docs, first grepping SDK internals with `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then reading declarations including `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, and `node_modules/mcp-use/README.md`. It also inspected package exports with `console.log(require('./node_modules/mcp-use/package.json').exports)`. No skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API-shape discovery through installed package internals rather than straightforward documentation. The agent first searched declarations with `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, then opened `dist/server.d.ts` and `dist/openapi/types.d.ts`, and finally inspected the minified implementation via `rg -n "registerOpenAPITools|requestBody|body" node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. This investigation was needed to establish the generated request-body convention: `the OpenAPI generator uses a \`body\` input wrapper for JSON request bodies`, which is reflected in `scripts/verify.ts` as `arguments: { body: { sku: "green-tea", quantity: 2 } }`. That convention is a notable OpenAPI tooling papercut because it was not evident from the initial type declarations.
