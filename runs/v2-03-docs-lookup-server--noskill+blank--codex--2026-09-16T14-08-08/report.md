# mcp-use SDK agentic eval — 2026-09-16

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-16T14-08-08` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m58s
- Median turns: 17
- Median tool calls: 22
- Median tokens in/out: 500405 / 5608
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent inspected the installed package’s README and declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. It also explored the MCP client package for verification via `rg -n "StreamableHTTP|resources/list|readResource|callTool" node_modules/@modelcontextprotocol/client/dist`. No skill file or external docs URL appears in the transcript; the visible resources were bundled `node_modules` files.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery friction was obtaining the SDK API shape. The first README attempt failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent switched to `npm pack mcp-use --pack-destination /tmp`, extracted the package, and inspected `README.md`, `dist/server.d.ts`, and `dist/resources.d.ts`. It then grepped declarations for `"listen\\(|resourceTemplate|resources/list|resource\\("`, relying on the packaged README and type files rather than a fetched docs page.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK API from installed declarations rather than readily surfaced package guidance: the agent first ran `npm view mcp-use readme --json`, which returned no README content, then searched `node_modules/mcp-use` for `"class MCPServer|streamable|resource\\("` and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. This worked, but required several exploratory commands before implementation.
