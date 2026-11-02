# mcp-use SDK agentic eval — 2026-11-02

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-02T14-06-27` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 631452 / 7452
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied on installed package internals rather than external docs or a skill file, first searching with `rg -n "fromOpenAPI|Streamable|streamable|HTTP" node_modules/mcp-use` and then inspecting `node_modules/mcp-use/dist/server.d.ts` and `dist/openapi/types.d.ts`. It also searched minified runtime code for request-body behavior via `rg -n "requestBody|params\\.body|body:" node_modules/mcp-use/dist/chunk-*.js`, suggesting the generated argument shape was not immediately obvious. The discovered API surprise was that JSON payloads are nested under a tool-level `body`; the tool listing showed `"required":["body"]`, and lifecycle calls consequently used `arguments:{body:{sku:"green-tea", quantity:2}}`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent leaned heavily on installed package internals to discover the API shape, running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and later searching bundled implementation with `rg -n -C 5 "fromOpenAPI|openapi" node_modules/mcp-use/dist/chunk-*.js`. One inspection command hit a dead end when reading several assumed declaration paths returned `"exitCode":2`, after which the agent performed additional searches for `listen(` in `server.d.ts`, `index.d.ts`, and `config.d.ts`. End-to-end verification similarly required exploring client package typings via `rg -n "StreamableHTTPClientTransport|Client\\(" node_modules/@modelcontextprotocol/client/dist`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed declarations and bundled implementation rather than docs, repeatedly grepping `node_modules` with commands such as `rg -n "fromOpenAPI|Streamable|streamable"` and inspecting `node_modules/mcp-use/dist/openapi/types.d.ts` plus `chunk-Y26DNVWA.js`; this was how it discovered that generated JSON request bodies use a `body` input, stated as “`The SDK exposes OpenAPI operations as generated tools with a body input`.”
