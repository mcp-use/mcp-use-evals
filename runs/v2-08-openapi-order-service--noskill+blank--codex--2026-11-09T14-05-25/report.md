# mcp-use SDK agentic eval — 2026-11-09

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-09T14-05-25` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m57s
- Median turns: 21
- Median tool calls: 22
- Median tokens in/out: 652522 / 8084
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than external docs, first grepping `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable"`, then reading `dist/server.d.ts`, `dist/openapi/types.d.ts`, and the minified OpenAPI implementation via `rg -n "fromOpenAPI" node_modules/mcp-use/dist/chunk-*.js`. This discovery involved dead ends: `sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory` and later `sed: can't read node_modules/@modelcontextprotocol/client/dist/index.d.ts`, because the client declarations were actually found under `dist/index.d.mts`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on package internals rather than a skill file or fetched docs: it inspected `node_modules/mcp-use/README.md`, declaration files, and bundled JavaScript with searches for `"fromOpenAPI|streamable|listen|mount"` and `"function registerOpenAPITools"`. This was useful for discovering the generated argument shape—`"uses a \`body\` input field for JSON request bodies, while path/query parameters remain top-level"`—but required several exploratory calls into `node_modules`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed package internals rather than external docs, first searching `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and later inspecting `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, and minified `chunk-Y26DNVWA.js` to discover request-body bindings and API shape.
