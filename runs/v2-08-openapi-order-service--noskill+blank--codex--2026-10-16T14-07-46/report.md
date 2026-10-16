# mcp-use SDK agentic eval — 2026-10-16

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-16T14-07-46` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 17
- Median tool calls: 21
- Median tokens in/out: 842931 / 7710
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent had SDK-discovery friction and relied heavily on installed package internals rather than external docs: it searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|StreamableHTTP|MCPServer"` and inspected `dist/server.d.ts`, `dist/openapi/types.d.ts`, the README, and generated JavaScript chunks. One lookup assumed an unbundled implementation and failed with `node_modules/mcp-use/dist/server.js: No such file or directory`; the agent then had to locate the implementation via `rg -l "function registerOpenAPITools|registerOpenAPITools"` and inspect `chunk-Y26DNVWA.js`. No skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent had to reverse-engineer SDK behavior from installed package declarations and bundled code rather than relying on documentation: it searched `node_modules` with `rg -n "fromOpenAPI|streamable|Streamable"` and then inspected the implementation around `registerOpenAPITools` to determine that generated request bodies use a `body` property, concluding, “`The SDK’s generated OpenAPI tools take the JSON request body under body`.” This worked, but indicates discovery friction around the OpenAPI-generated tool input shape and HTTP mounting API.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than external docs, grepping declarations and bundles with `rg -n "fromOpenAPI|Streamable|streamable|listen\(" node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts` plus `openapi/types.d.ts`. It also explored the MCP client API through `rg -n "StreamableHTTPClientTransport"` under `node_modules/@modelcontextprotocol/client/dist`, indicating some API-shape discovery friction.
