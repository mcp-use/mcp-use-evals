# mcp-use SDK agentic eval — 2026-08-19

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-19T14-13-32` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m23s
- Median turns: 24.5
- Median tool calls: 32.5
- Median tokens in/out: 1347081.5 / 10003.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than a skill or external docs, first searching with `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. SDK discovery was mildly awkward because the expected implementation file did not exist: `rg: node_modules/mcp-use/dist/server.js: IO error ... No such file or directory`, forcing a second search through bundled chunks where it found `chunk-Y26DNVWA.js`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was API discovery through installed package internals rather than a skill or external docs. The agent ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, bundled JavaScript, and `@modelcontextprotocol/client` declarations before stating it had confirmed that the generator “`maps a JSON body to the generated body tool argument and preserves upstream error text`.” This suggests the required OpenAPI request/error behavior was not immediately obvious from the top-level API.
