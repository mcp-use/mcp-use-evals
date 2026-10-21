# mcp-use SDK agentic eval — 2026-10-21

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-21T14-07-58` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 19
- Median tool calls: 22
- Median tokens in/out: 666537 / 7977
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than docs: it queried npm with `npm view mcp-use@2.0.4 version description exports --json`, then grepped declarations using `rg -n "fromOpenAPI|streamable|listen\(|MCPServer" node_modules/mcp-use/dist --glob '*.d.ts'`, and inspected runtime implementation around `registerOpenAPITools`. This successfully clarified tag filtering and error behavior, summarized as `"supports the required tag filter and raw upstream error propagation"`, but contributed several exploratory calls before implementation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on installed declaration files rather than a skill or fetched documentation, first grepping `node_modules/mcp-use` with `rg -n "fromOpenAPI|streamable|Streamable|transport"` and then reading `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. It repeated this discovery process for lifecycle testing by searching `@modelcontextprotocol/client` for `StreamableHTTPClientTransport`, suggesting the relevant server and client API shapes were not immediately obvious.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The main friction was API discovery through installed package internals rather than a concise SDK example: the agent ran `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use/dist` and inspected `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. Client verification required several more searches after the first returned nothing: `rg -n "StreamableHTTPClientTransport|class Client" ...` produced `output":""`, followed by inspection of `@modelcontextprotocol/client/dist/index.d.mts` and searches for `listTools|callTool`.
