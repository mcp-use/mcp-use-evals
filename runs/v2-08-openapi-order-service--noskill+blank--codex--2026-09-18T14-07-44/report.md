# mcp-use SDK agentic eval — 2026-09-18

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-18T14-07-44` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m22s
- Median turns: 19
- Median tool calls: 21
- Median tokens in/out: 705833 / 8007
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was SDK/API discovery through installed declarations rather than docs or a skill file. The agent grepped `node_modules` for `"fromOpenAPI|Streamable|streamable|class MCPServer"` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the MCP client’s generated `index.d.mts`. Its first declaration lookup used a nonexistent path and failed with `sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory`, after which it recovered via `find node_modules/mcp-use/dist ... -name '*.d.ts'`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was API discovery: the agent inspected the installed SDK rather than using a skill file or fetched documentation, first running `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and then reading `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/openapi/types.d.ts`. One declaration-inspection command took a wrong turn and exited with code 2 while requesting nonexistent or unavailable paths including `node_modules/mcp-use/dist/node-http.d.ts` and `node_modules/mcp-use/dist/index-node.d.ts`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main time sink was SDK API discovery through installed package internals: the agent searched `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable|createHTTP|http"` and then inspected `node_modules/mcp-use/dist/server.d.ts` plus `dist/openapi/types.d.ts`. That path included a wrong assumption about emitted files: `rg: node_modules/mcp-use/dist/server.js: No such file or directory`, requiring another pass against bundled chunk files and declarations. Client transport discovery had similar packaging friction: attempting `sed ... node_modules/@modelcontextprotocol/client/dist/index.d.ts` failed because the package instead exposed `index.d.mts`/`index.d.cts`, after which the agent inspected `package.json` exports and searched for `"StreamableHTTP|StreamableHttp|streamable"`.
