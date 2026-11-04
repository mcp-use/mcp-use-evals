# mcp-use SDK agentic eval — 2026-11-04

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-04T14-06-06` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m41s
- Median turns: 16
- Median tool calls: 19
- Median tokens in/out: 612899 / 6992
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main friction was API-shape discovery: the agent repeatedly inspected installed declarations and implementation with `rg -n "fromOpenAPI|StreamableHTTP|streamable" node_modules/mcp-use`, `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`, and finally `rg -n "requestBody|parameters" node_modules/mcp-use/dist/openapi`. It relied on grepping `node_modules`, not a skill file or fetched docs, before concluding that “`generated OpenAPI tools take path/query fields directly and JSON bodies under body`”; the decisive evidence came from minified bundled JavaScript containing `bodyInputName=...:"body"`, suggesting this generated argument shape was not readily discoverable from higher-level documentation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main SDK discovery cost was local package spelunking: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`; it later repeated this for `@modelcontextprotocol/client` to find `StreamableHTTPClientTransport`, `listTools()`, and `callTool()`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main wrong turn was importing a nonexistent subpath: typechecking failed with `Cannot find module 'mcp-use/openapi' or its corresponding type declarations`, after which the agent modified `src/server.ts` to import `MCPServer` from `"mcp-use"`.
