# mcp-use SDK agentic eval — 2026-08-05

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-05T14-50-23` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m16s
- Median turns: 17
- Median tool calls: 25
- Median tokens in/out: 920328 / 8150
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on grepping installed SDK artifacts for API shape, using `rg -n "fromOpenAPI|listen\\(" node_modules/mcp-use/dist/server.d.ts` and inspecting `node_modules/mcp-use/dist/openapi/types.d.ts`; no external docs URL or skill file appears in the visible workflow. This discovery established that `listen()` returns the actual MCP URL and that `fromOpenAPI()` exists, but required several node_modules inspection calls before implementation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than external docs or a skill file, first grepping `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable|MCPServer"`, then reading `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and `dist/openapi/index.js`. It also inspected the official MCP client example at `node_modules/@modelcontextprotocol/sdk/dist/esm/examples/client/simpleStreamableHttp.js` to construct lifecycle verification.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than external docs or a skill file, first running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and `README.md`. It later inspected generated implementation code via `sed -n '1,280p' node_modules/mcp-use/dist/openapi/index.js` and searched the MCP client package for `StreamableHTTP`, indicating notable API-discovery friction.
