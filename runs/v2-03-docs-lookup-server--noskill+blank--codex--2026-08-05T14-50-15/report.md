# mcp-use SDK agentic eval — 2026-08-05

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-05T14-50-15` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 639473 / 5032
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals to discover the SDK shape, running `rg -n "Streamable|resource|addTool|createMCP" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and the package README. It similarly explored the bundled MCP client rather than using an external docs URL: `rg -n "StreamableHTTP|StreamableHttp|Client\\(" node_modules/@modelcontextprotocol/client`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main time loss was SDK discovery: `npm view mcp-use readme --json` returned an empty output, so the agent inspected installed package files instead with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `sed -n '1,240p' node_modules/mcp-use/dist/resources.d.ts`, and `rg -n "resource\\(|listen\\(|Streamable|HTTP|http" node_modules/mcp-use/README.md`. No mcp-use skill file or fetched docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent leaned heavily on installed-package internals rather than a skill or external docs: it opened `node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `config.d.ts`. Verification required further API-shape discovery through `node_modules/@modelcontextprotocol/client/dist/index.d.mts`, including repeated searches for `"StreamableHTTPClientTransport"`, `"listResources"`, `"readResource"`, and `"callTool"`.
