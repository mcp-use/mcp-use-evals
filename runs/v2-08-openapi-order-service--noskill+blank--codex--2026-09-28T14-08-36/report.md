# mcp-use SDK agentic eval — 2026-09-28

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-28T14-08-36` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m06s
- Median turns: 23
- Median tool calls: 28
- Median tokens in/out: 770079 / 7931
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API discovery through installed package internals: the agent ran `rg -n "fromOpenAPI|streamable" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`, and then inspected the minified implementation in `node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. It also relied on the locally installed MCP client README and declarations—`node_modules/@modelcontextprotocol/client/README.md` and `dist/index.d.mts`—rather than a skill file or fetched docs URL.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was SDK API discovery through installed package internals rather than a skill file or fetched documentation: the agent ran `rg -n "fromOpenAPI|StreamableHTTP|streamable|MCPServer" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`, then opened the minified implementation at `node_modules/mcp-use/dist/chunk-Y26DNVWA.js`. Client verification required another round of package spelunking with `rg -n "StreamableHTTP|class Client|listTools|callTool" node_modules/@modelcontextprotocol/client/dist`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was SDK API discovery through installed package internals rather than documentation: the agent ran `rg -n "fromOpenAPI|StreamableHTTP|streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`. That exploration included a wrong declaration path—`sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory`—followed by `find node_modules/mcp-use/dist ... -name '*.d.ts'` to locate the actual files. No skill file or fetched docs URL appears in the transcript; the cited resources were npm metadata via `npm view mcp-use@2.0.4 ...` and grepping `node_modules`.
