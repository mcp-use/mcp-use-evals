# mcp-use SDK agentic eval — 2026-10-07

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-07T14-07-28` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m04s
- Median turns: 22
- Median tool calls: 25
- Median tokens in/out: 858952 / 9779
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main friction was API discovery: the agent repeatedly inspected installed declarations and implementation rather than relying on straightforward documentation, first with `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, then reading `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, `node-http.d.ts`, and `mount-mcp.d.ts`. It even searched minified runtime code for `registerOpenAPITools`, finding `node_modules/mcp-use/dist/chunk-Y26DNVWA.js`; this suggests the generated input shape and tag-filter behavior were not immediately obvious from the public API surface. Client-side lifecycle verification required another sequence of declaration searches, including `rg -n "StreamableHTTP|ClientTransport|class Client"` and later `rg -n "listTools|callTool"` under `node_modules/@modelcontextprotocol/client/dist/index.d.mts`. No skill file or fetched docs URL appears in the transcript; the resources visibly used were package README/type declarations and grepping `node_modules`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on local package inspection rather than external docs, first running `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and the bundled `README.md`. Discovery had some friction: searches assumed nonexistent paths and failed with `node_modules/mcp-use/dist/server.js: No such file or directory` and `node_modules/@modelcontextprotocol/sdk/dist: IO error`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent had to discover the OpenAPI API shape by inspecting the installed package rather than using an obvious guide: it ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and then examined `dist/openapi/types.d.ts` and the minified `chunk-Y26DNVWA.js`. The bundled README quickstart focused on manually registered tools—`const server = new MCPServer({` and `server.tool(`—so it did not directly answer the task’s `fromOpenAPI` questions.
