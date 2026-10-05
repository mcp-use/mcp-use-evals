# mcp-use SDK agentic eval — 2026-10-05

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-05T14-10-35` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m57s
- Median turns: 22
- Median tool calls: 26
- Median tokens in/out: 943034 / 8598
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent spent substantial discovery time inspecting installed declarations and implementation rather than using documentation: it ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/openapi/types.d.ts` and `server.d.ts`, and later searched the minified implementation with `rg -n "requestBody|parameters|query" node_modules/mcp-use/dist/chunk-*.js`. It similarly reverse-engineered the MCP client API via `rg -n "StreamableHTTPClientTransport" node_modules/@modelcontextprotocol/client`, suggesting the SDK/client API shape was not immediately discoverable from package entry points.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery: the agent repeatedly inspected installed package internals, first with `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use`, then reading `node_modules/mcp-use/dist/openapi/types.d.ts`, `server.d.ts`, and bundled JavaScript, and later searching `node_modules/@modelcontextprotocol/client` for `StreamableHTTP` and `callTool`. No skill file or fetched docs URL appears; it relied on the package README, declarations, and implementation, including `sed -n '100,190p' node_modules/mcp-use/README.md`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was API discovery rather than implementation: after `find .. -name AGENTS.md -print` returned an empty result, the agent fetched package metadata with `npm view mcp-use@2.0.4`, unpacked the SDK using `npm pack mcp-use@2.0.4`, and searched its README, declarations, and compiled bundle with `rg -n -C 5 'fromOpenAPI|streamable|HTTP|listen'`. It then separately grepped installed client declarations for lifecycle-test APIs—`rg ... 'StreamableHTTPClientTransport|class Client'` and `rg -n 'listTools\\(|callTool\\('`—showing that the client API shape also required node_modules inspection.
