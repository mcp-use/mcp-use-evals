# mcp-use SDK agentic eval — 2026-09-23

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-23T14-08-02` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m41s
- Median turns: 21
- Median tool calls: 26
- Median tokens in/out: 850054 / 8255.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main wrong turn was importing the OpenAPI type from an unexported subpath: typechecking failed with `src/openapi.ts(1,38): error TS2307: Cannot find module 'mcp-use/openapi'`. The agent then inspected package declarations and found the root export, `export type { FromOpenAPIOptions, OpenAPIAuth, OpenAPIDocument, OpenAPIExcludeRule, } from "./openapi/index.js";`, after which `npm run typecheck && npm run verify` passed. This suggests a small package-export/API-discovery papercut.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed package internals rather than docs, searching `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable"` and reading `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `config.d.ts`. It also inspected the MCP client package repeatedly for verification APIs, including `rg -n "StreamableHTTP"` and `rg -n "listTools\\(|callTool\\("`, which contributed substantial discovery overhead.
