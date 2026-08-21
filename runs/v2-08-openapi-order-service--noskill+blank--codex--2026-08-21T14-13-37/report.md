# mcp-use SDK agentic eval — 2026-08-21

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-21T14-13-37` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m37s
- Median turns: 16
- Median tool calls: 21
- Median tokens in/out: 650312 / 6996
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied on local package inspection rather than a skill file or fetched docs, grepping `node_modules/mcp-use` for `"fromOpenAPI|streamable|Streamable|MCPServer"` and then reading `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, and `README.md`. It went further into bundled implementation code with `"registerOpenAPITools|requestBody|raw tool-result|not found"`, suggesting the public README/types did not immediately answer request-body binding and error-propagation questions.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery through installed package internals rather than documentation: the agent ran `rg -n "fromOpenAPI|streamable|Streamable|connect" node_modules/mcp-use/dist node_modules/mcp-use` and repeatedly inspected `node_modules/mcp-use/dist/server.d.ts`, including the `listen(port?: number...)` signature. MCP verification required similar spelunking in the transitive client package, with searches for `"class StreamableHTTPClientTransport"` and `"listTools\\(|callTool\\("` under `node_modules/@modelcontextprotocol/client/dist`; no skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied on installed package artifacts rather than a skill file or fetched docs, explicitly searching `node_modules/mcp-use` with `rg -n "fromOpenAPI|Streamable|streamable"` and inspecting `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts` to discover API shape.
