# mcp-use SDK agentic eval — 2026-08-07

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-08-07T14-23-32` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m09s
- Median turns: 23
- Median tool calls: 30
- Median tokens in/out: 1203207 / 8972
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The main time sink was API discovery through installed package internals rather than documentation: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use`, inspected `node_modules/mcp-use/dist/server.d.ts` and `openapi/types.d.ts`, then searched bundled JavaScript for `"requestBody"` to learn that request bodies map to a `"body"` tool argument. Client verification required another long inspection sequence under `node_modules/@modelcontextprotocol/client/dist`, including searches for `"class Client|class Streamable"` and `"listTools|callTool"`. No skill file or fetched docs URL appears; the external discovery resource was npm metadata via `npm view mcp-use@2.0.4 version dependencies peerDependencies dist.tarball`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main friction was SDK/API discovery: the agent repeatedly inspected installed declarations and bundled implementation with commands such as `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use`, `sed -n '1,240p' node_modules/mcp-use/dist/openapi/types.d.ts`, and searches for `function registerOpenAPITools`. It also had to grep the transitive MCP client package for verification transport shape—`rg -n "StreamableHTTPClientTransport" node_modules/@modelcontextprotocol/client`—rather than relying on readily surfaced examples.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed package declarations and implementation files to discover API shape, e.g. `rg -n "fromOpenAPI|Streamable|streamable|MCPServer" node_modules/mcp-use` and later inspecting `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and `openapi/index.js`. Client-side verification required further package archaeology through `find node_modules/@modelcontextprotocol/client` and `rg -n "StreamableHTTP|class Client"` rather than a concise documented example.
