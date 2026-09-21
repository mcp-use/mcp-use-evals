# mcp-use SDK agentic eval — 2026-09-21

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-21T14-08-12` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 17
- Median tool calls: 24
- Median tokens in/out: 593702 / 5124
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was obtaining the SDK API shape. The initial npm README attempt failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent pivoted to inspecting installed declarations and docs directly via `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "resourceTemplate\\(|uriTemplate|server\\.resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist -g '*.d.ts'`. This worked, but required several exploratory calls across `index.d.ts`, `server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `response-helpers.d.ts`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then inspected installed declarations via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched for `"resourceTemplate|resources/list|server.listen"`. No skill file or external docs URL was used; the implementation leaned on `node_modules/mcp-use/dist/*.d.ts`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on installed-package discovery rather than external docs, grepping `node_modules/mcp-use` for `"Streamable|streamable|resource\\(|tool\\(|MCPServer"` and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. It also inspected the bundled MCP client API via `node_modules/@modelcontextprotocol/client/dist/index.d.mts` to find `"listResources\\(|readResource\\(|callTool\\("`.
