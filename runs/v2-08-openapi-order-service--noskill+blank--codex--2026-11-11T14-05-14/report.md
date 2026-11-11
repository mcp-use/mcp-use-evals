# mcp-use SDK agentic eval — 2026-11-11

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-11T14-05-14` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m48s
- Median turns: 14
- Median tool calls: 24
- Median tokens in/out: 827383 / 7495
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than working from an immediately known API: it ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and opened `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `openapi/types.d.ts`, and the README. This exploration established that the factory and listener defaults were sufficient: “`The SDK’s OpenAPI factory generates the tools directly and keeps its default /mcp streamable endpoint`.”
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main time sink was API discovery through installed package internals rather than documentation: the agent searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|Streamable|streamable"` and then inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `config.d.ts`. It similarly had to discover the verification client by searching `@modelcontextprotocol/client` for `"StreamableHTTP|class Client|tools/list|callTool"` and later `"class StreamableHTTPClientTransport"` and `"connect\\("`; no skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery: the agent repeatedly inspected installed declarations rather than using SDK docs, including `rg -n "fromOpenAPI|streamable|StreamableHTTP" node_modules/mcp-use`, `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts`, and searches in `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for `"listTools\\(|callTool\\("`. No mcp-use skill file or fetched docs URL appears in the transcript.
