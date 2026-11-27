# mcp-use SDK agentic eval — 2026-11-27

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-11-27T14-05-03` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m50s
- Median turns: 19
- Median tool calls: 20
- Median tokens in/out: 598325 / 7058
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main SDK discovery cost was inspecting the installed package rather than relying on documentation: the agent ran `rg -n "fromOpenAPI|streamable|HTTP" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `README.md`, then searched compiled JavaScript for `"requestBody|body"` to determine that generated create inputs use a nested `body` argument. This investigation paid off, as `tools/list` later showed `"required":["body"]`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than external docs or a skill file: it searched `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable|MCPServer"` and inspected `dist/server.d.ts`, `dist/openapi/types.d.ts`, and `dist/chunk-Y26DNVWA.js`. This source inspection clarified a non-obvious generated-tool shape: `"The SDK exposes request bodies as a generated \`body\` tool argument"` while path/query parameters stay top-level.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first pulled the package README via `npm view mcp-use@2.0.4 readme`, then inspected installed declarations with `rg -n "fromOpenAPI|streamable|listen\\(" node_modules/mcp-use`, including `server.d.ts` and `openapi/types.d.ts`, before implementing. Client discovery took a wrong turn because it initially searched the obsolete package path and got `find: ‘node_modules/@modelcontextprotocol/sdk’: No such file or directory`; it then found the actual split package at `node_modules/@modelcontextprotocol/client` and inspected its exports and declarations.
