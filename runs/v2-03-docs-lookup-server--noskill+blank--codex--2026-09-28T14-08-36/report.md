# mcp-use SDK agentic eval — 2026-09-28

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-28T14-08-36` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 629889 / 5362
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape manually rather than relying on a skill or fetched docs: it inspected `node_modules/mcp-use/README.md`, then queried declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched for `"listen|streamable|serve|resource\\("`. This discovery took several calls, including a search that produced the distracting error `rg: node_modules/mcp-use/dist/server.js: No such file or directory`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK API from the installed package rather than from a skill or external docs: the agent first queried npm with `npm view mcp-use version description repository.url peerDependencies dependencies --json`, then searched declarations using `rg -n "createMcpServer|McpServer|resource\(|tool\(|streamable|Streamable" node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/resources.d.ts`. This worked, but required several exploratory calls before implementation.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had notable API-discovery friction and relied on installed package internals rather than a skill file or fetched docs: it inspected `node_modules/mcp-use/README.md`, then `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and searched implementation bundles with `rg -n "async listen|listen\\(" node_modules/mcp-use/dist/index-node.js node_modules/mcp-use/dist/chunk-*.js`. It also inspected the MCP client declarations before verification: `sed -n '1,180p' node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.d.ts` and `rg -n "listResources|readResource|callTool\\(" .../client/index.d.ts`.
