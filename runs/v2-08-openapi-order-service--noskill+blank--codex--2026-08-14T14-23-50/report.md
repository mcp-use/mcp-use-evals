# mcp-use SDK agentic eval — 2026-08-14

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-14T14-23-50` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m06s
- Median turns: 21
- Median tool calls: 27
- Median tokens in/out: 978250 / 9201
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main friction was SDK API discovery through installed package internals rather than a skill file or external docs: the agent inspected `node_modules/mcp-use/README.md`, then `dist/server.d.ts`, `dist/openapi/types.d.ts`, and searched for `"fromOpenAPI|streamable|listen\\("`. This was productive, but required several exploratory calls before implementation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on package internals rather than a skill file or fetched docs: it ran `rg -n "fromOpenAPI|Streamable|streamable|http" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/openapi/types.d.ts`, and `node_modules/mcp-use/README.md`. It also grepped the generated implementation for request-body behavior: `rg -n "function fromOpenAPI|fromOpenAPI|requestBody|body" ... node_modules/mcp-use/dist/chunk-*.js`. This suggests API discovery required navigating declarations and bundled code.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed package declarations and implementation for API discovery, starting with `rg -n "fromOpenAPI|Streamable|streamable" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. It also inspected generated JavaScript via `rg -n "function fromOpenAPI|fromOpenAPI|requestBody|parameters" node_modules/mcp-use/dist/chunk-*.js`, suggesting the public README/types did not immediately answer all OpenAPI request and error-shape questions. No skill file or fetched docs URL appears; the README only exposed a documentation link, ``https://docs.mcp-use.com/v2/typescript/getting-started/welcome``.
