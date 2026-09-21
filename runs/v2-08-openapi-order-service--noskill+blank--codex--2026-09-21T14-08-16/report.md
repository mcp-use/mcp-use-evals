# mcp-use SDK agentic eval — 2026-09-21

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-21T14-08-16` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (1/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 1/1 |

## Performance (passing trials)

- Median duration: 2m43s
- Median turns: 20
- Median tool calls: 26
- Median tokens in/out: 1220056 / 9082
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API discovery through installed package internals rather than documentation: the agent repeatedly searched declarations with `rg -n "fromOpenAPI|Streamable|streamable|class MCPServer|listen\\(" node_modules/mcp-use`, then inspected `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. MCP client verification required another round of package archaeology via `find node_modules/@modelcontextprotocol/client` and `rg -n "declare class Client|listTools\\(|callTool\\("`; the first assumed layout was wrong, producing `sed: can't read node_modules/@modelcontextprotocol/client/dist/client/index.d.ts: No such file or directory`. No skill file or fetched docs URL appears in the transcript; the visible resource was primarily `node_modules`.
