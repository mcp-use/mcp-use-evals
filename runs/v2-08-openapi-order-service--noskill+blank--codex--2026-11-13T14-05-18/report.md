# mcp-use SDK agentic eval — 2026-11-13

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-13T14-05-18` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m21s
- Median turns: 21
- Median tool calls: 27.5
- Median tokens in/out: 1015624 / 9842.5
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

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than external docs, searching `node_modules/mcp-use/dist/*.d.ts` for `"fromOpenAPI|streamable|Streamable|MCPServer"` and inspecting `node_modules/mcp-use/dist/openapi/types.d.ts` plus `server.d.ts`. It similarly explored the MCP client API by grepping for `"StreamableHTTPClientTransport"` and `"listTools\\(|callTool\\("` under `node_modules/@modelcontextprotocol/client`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was SDK API discovery: the agent repeatedly grepped installed declarations and implementation—`rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and later `rg -n "requestBody|body:" node_modules/mcp-use/dist -g '*.js'`—then inspected `server.d.ts`, `openapi/types.d.ts`, `node-http.d.ts`, and the packaged README. No skill file or external docs URL was used; the resources shown were `node_modules/mcp-use/README.md` and installed SDK source/types.
