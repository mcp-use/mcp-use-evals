# mcp-use SDK agentic eval — 2026-08-12

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-12T14-27-39` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m04s
- Median turns: 17
- Median tool calls: 22
- Median tokens in/out: 1078451 / 8280
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed SDK internals rather than docs, first grepping `node_modules/mcp-use` for `"fromOpenAPI|streamable|HTTP"`, then reading `dist/server.d.ts`, `dist/openapi/types.d.ts`, and bundled implementation code to infer that generated tools use a `"body"` wrapper. This discovery worked, but exposed an API-surface papercut: importing `mcp-use/openapi` failed with `TS2307: Cannot find module 'mcp-use/openapi'`, requiring a source rewrite to derive the spec type from `Parameters<(typeof import("mcp-use"))["MCPServer"]["fromOpenAPI"]>[0]` in `src/server.ts`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main time sink was API-shape discovery through installed package internals rather than a concise example: the agent repeatedly ran searches such as `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/openapi/types.d.ts`, and even searched the bundled `node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. This investigation established the non-obvious generated-input convention that “`request-body input is a body object, while path/query parameters stay top-level`”; that behavior would benefit from prominent OpenAPI documentation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied on grepping installed package declarations for SDK shape rather than a skill file or fetched docs: `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` followed by inspection of `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`. It similarly inspected the underlying MCP client API with `rg -n "listTools|callTool" node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.d.ts`.
