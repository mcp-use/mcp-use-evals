# mcp-use SDK agentic eval — 2026-09-02

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-09-02T14-07-55` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 15
- Median tool calls: 21
- Median tokens in/out: 741624 / 7624
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than external docs or a skill file, first grepping `node_modules/mcp-use` with `rg -n "fromOpenAPI|Streamable|streamable|createStream"` and then reading `node_modules/mcp-use/dist/server.d.ts`, `mount-mcp.d.ts`, and `openapi/types.d.ts`. This successfully exposed useful API details such as `listen(port?: number ...): Promise<{ port: number; url: string; }>`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent had notable API-discovery friction and relied heavily on installed package internals rather than documentation: it searched `node_modules/mcp-use` for `"fromOpenAPI|Streamable|streamable|httpTransport|MCPServer"`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `dist/openapi/types.d.ts`, and bundled implementation code containing `function registerOpenAPITools(server,options)`. This investigation was needed to discover the generated request-body shape; the agent explicitly concluded, `"The SDK’s OpenAPI generator uses a single \`body\` input for JSON request bodies"`. It also grepped `node_modules/@modelcontextprotocol/client` for `"StreamableHTTPClientTransport|class Client"` and later `"listTools\\(|callTool\\("` to construct lifecycle verification. No skill file or fetched docs URL appears in the transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main SDK discovery cost was inspecting installed declarations rather than using docs: the agent ran `rg -n "fromOpenAPI|streamable|Streamable|MCPServer" node_modules/mcp-use` and opened `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts` to determine `fromOpenAPI` and `listen` shapes. It similarly grepped `node_modules/@modelcontextprotocol/sdk/dist/esm/client` for `StreamableHTTPClientTransport`, `listTools`, and `callTool` before writing the lifecycle check.
