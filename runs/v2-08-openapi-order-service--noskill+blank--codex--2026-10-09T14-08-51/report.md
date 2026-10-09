# mcp-use SDK agentic eval — 2026-10-09

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-09T14-08-51` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m33s
- Median turns: 18
- Median tool calls: 23
- Median tokens in/out: 731864 / 7630
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed SDK declarations and implementation rather than a skill file or fetched docs, searching `node_modules/mcp-use` with `rg -n "fromOpenAPI|Streamable|streamable"` and later inspecting `server.d.ts`, `openapi/types.d.ts`, and `chunk-*.js`. This discovery had a minor dead end when the declaration-inspection command exited `2`, despite yielding useful output, and the later `listen()` declaration clarified endpoint behavior with `HTTP URL of the bound MCP endpoint`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main discovery friction was determining the SDK API shape by inspecting installed declarations rather than using documentation: the agent ran `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and then opened `node_modules/mcp-use/dist/openapi/types.d.ts` and `node_modules/mcp-use/dist/server.d.ts`. One inspection command took a wrong turn because it assumed an unbundled runtime file existed: `rg: node_modules/mcp-use/dist/server.js: No such file or directory (os error 2)`, after which the agent recovered by listing `node_modules/mcp-use/dist` and searching its bundled `.js` files.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on installed package internals rather than documentation, first inspecting declarations with `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts` and then searching client types via `rg -n "class Client|StreamableHTTP" node_modules/@modelcontextprotocol/client/dist`. Discovering OpenAPI request-shape behavior took an unsuccessful search—`rg -n "requestBody|parameter|response.text|not ok|response.ok|fetch\\(" node_modules/mcp-use/dist/openapi -g '*.js'` returned `exitCode":1`—followed by locating and inspecting the bundled implementation with `find node_modules/mcp-use/dist/openapi` and `rg -n "registerOpenAPITools|fromOpenAPI|OpenAPI"`. That investigation exposed an API-shape papercut: `The SDK’s generated OpenAPI tools use a single \`body\` input for JSON request bodies, while path and query parameters remain top-level.`
