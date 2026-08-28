# mcp-use SDK agentic eval — 2026-08-28

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-28T18-02-22` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m57s
- Median turns: 20
- Median tool calls: 25
- Median tokens in/out: 939815 / 8900
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main discovery friction was determining the SDK API shape: the agent repeatedly inspected installed declarations and implementation with commands such as `rg -n "fromOpenAPI|Streamable|streamable|createServer|MCPServer" node_modules/mcp-use` and `sed -n '1,180p' node_modules/mcp-use/dist/openapi/types.d.ts`. One inspection took a wrong path and produced `node_modules/mcp-use/dist/server.js: IO error ... No such file or directory`, after which the agent continued searching bundled chunks with `rg -l "fromOpenAPI|async listen" node_modules/mcp-use/dist/*.js`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main time sink was SDK API discovery through installed package internals rather than docs: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|class MCPServer|connect" node_modules/mcp-use` and then inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the bundled `chunk-Y26DNVWA.js` to determine that create inputs use a nested `body` while path/query parameters are direct fields. No skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was API discovery through installed package internals: the agent ran `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use/dist`, inspected `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`, then separately searched `@modelcontextprotocol/client` for `class Client`, `StreamableHTTP`, `listTools()`, and `callTool()`. This suggests the SDK/client API shape was not obvious without grepping declarations; no skill file or fetched documentation URL appears in the transcript.
