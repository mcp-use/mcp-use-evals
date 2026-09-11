# mcp-use SDK agentic eval — 2026-09-11

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-11T14-08-05` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m04s
- Median turns: 13
- Median tool calls: 23
- Median tokens in/out: 763319 / 7912
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent spent substantial discovery time grepping installed declarations and package internals for API shape: `rg -n "fromOpenAPI|streamable|Streamable|transport" node_modules/mcp-use`, followed by reads of `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `config.d.ts`. It also inspected the MCP client package after an incorrect declaration path failed with `sed: can't read node_modules/@modelcontextprotocol/client/dist/index.d.ts`; it then queried package exports and found `dist/index.d.mts`. No skill file or fetched docs URL appears in the transcript; the primary resource was `node_modules`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main discovery cost was inspecting installed SDK internals rather than using a higher-level guide: the agent ran `rg -n "fromOpenAPI|StreamableHTTP|streamable" node_modules/mcp-use` and then opened `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, `config.d.ts`, and `index.d.ts`. This investigation established the listener shape and route behavior from declarations such as `listen(port?: number ...): Promise<{ ... url: string; }>`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was SDK/API discovery through installed package internals: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, `node-bridge.d.ts`, and the README. No skill file or fetched docs URL appears; the transcript instead shows repeated grepping of `node_modules` for `listen`, `baseUrl`, `StreamableHTTPClientTransport`, `listTools`, and `callTool`.
