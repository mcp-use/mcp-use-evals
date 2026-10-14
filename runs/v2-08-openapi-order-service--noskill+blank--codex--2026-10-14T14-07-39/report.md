# mcp-use SDK agentic eval — 2026-10-14

Run `v2-08-openapi-order-service--noskill+blank--codex--2026-10-14T14-07-39` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-08-openapi-order-service | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m51s
- Median turns: 21
- Median tool calls: 26
- Median tokens in/out: 911623 / 9432
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-08-openapi-order-service` · `noskill+blank` · trial 1 — [trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than external docs, grepping `node_modules/mcp-use` for `"fromOpenAPI|streamable|Streamable|MCPServer"` and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/openapi/types.d.ts`. This surfaced the useful `listen(port?: number...)` signature and its returned `"url"`.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 2 — [trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t2/memo.md): The main discovery cost was API-shape investigation in installed packages: the agent ran `rg -n "fromOpenAPI|Streamable|streamable" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts`, `openapi/types.d.ts`, and the MCP client declarations before concluding that JSON bodies become a nested `body` argument: `The SDK’s OpenAPI helper generates a single \`body\` argument`. This suggests the generated tool-input convention was not obvious without grepping `node_modules`; no skill file or external docs URL was used in the visible transcript.
- `v2-08-openapi-order-service` · `noskill+blank` · trial 3 — [trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md](trials/v2-08-openapi-order-service--noskill+blank--t3/memo.md): The agent relied primarily on installed SDK declarations and implementation internals rather than docs, first searching `rg -n "fromOpenAPI|Streamable|streamable" node_modules/mcp-use` and later grepping bundled code with `rg ... "requestBody|required property 'body'|body:" node_modules/mcp-use/dist`. No skill file or fetched docs URL appears in the transcript.
