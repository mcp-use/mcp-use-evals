# mcp-use SDK agentic eval — 2026-10-12

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-12T14-14-06` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m13s
- Median turns: 23
- Median tool calls: 32
- Median tokens in/out: 828593 / 8484
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed package declarations and implementation greps rather than documentation, first searching `node_modules/mcp-use` for `"fromOpenAPI|StreamableHTTP|streamable"` and reading `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. It also inspected the MCP client package after an initial lookup failed with `No such file or directory`, then searched exports for `"StreamableHTTPClientTransport|Client"`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The agent relied heavily on inspecting installed declarations and implementation rather than external docs, using searches such as `rg -n "fromOpenAPI|streamable|StreamableHTTP|http" node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the MCP client declarations. This discovery established that “`The SDK’s OpenAPI generator supports tag filtering directly, and its default HTTP endpoint is /mcp`,” but required several exploratory commands before implementation.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed declarations rather than a skill file or fetched docs, using commands such as `rg -n "fromOpenAPI|streamable|Streamable" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/openapi/types.d.ts`. It similarly discovered the verifier API through `rg -n "Streamable" node_modules/@modelcontextprotocol/client`, then concluded that generated request bodies use `body`: “`I’ve confirmed its OpenAPI helper generates request-body input under body`.”
