# mcp-use SDK agentic eval — 2026-10-28

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-28T14-06-33` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m35s
- Median turns: 18
- Median tool calls: 23
- Median tokens in/out: 869750 / 8161
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The run passed, but SDK discovery was source-inspection heavy: the agent first fetched package metadata with `npm view mcp-use@2.0.4`, unpacked the release using `npm pack mcp-use@2.0.4`, then searched declarations and even minified implementation via `rg -n -C 12 "fromOpenAPI|requestBody|body" /tmp/mcp-use-inspect/package/dist/index-node.js`. It later repeated this against installed dependencies with `sed -n '1,220p' node_modules/mcp-use/dist/index.d.ts` and searches under `node_modules/@modelcontextprotocol/client/dist`, suggesting the exported API and client verification setup were not immediately discoverable from the README/types initially inspected.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main SDK discovery friction was resolving API shape from installed package internals rather than an obvious example: the agent searched `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and `README.md`. This did reveal useful listener behavior, including `listen(port?: number ...): Promise<{ ... url: string; }>`, but required several exploratory commands.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery through installed package internals rather than a skill file or fetched docs: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`. It also searched the bundled client declarations for transport and call shapes with `rg -n "StreamableHTTP"` and `rg -n "declare class Client|listTools\\(|callTool\\("`, suggesting the MCP verification-client API was not immediately obvious.
