# mcp-use SDK agentic eval — 2026-09-04

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-04T14-07-24` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m47s
- Median turns: 13
- Median tool calls: 26
- Median tokens in/out: 670466 / 5619
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than using a skill or fetched docs: `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`, `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts`, and `rg -n "resource\\(|listen\\(|Streamable|streamable" node_modules/mcp-use/README.md node_modules/mcp-use/dist`. This worked, but required several exploratory commands before implementation.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent spent substantial discovery effort inspecting installed package internals rather than using a skill or fetched docs: it read `node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, `tools.d.ts`, and searched for `listen(`. It also explored the transitive MCP client API with searches for `"StreamableHTTPClientTransport"`, `"listResources("`, `"readResource("`, and `"callTool("`. This worked, but indicates API-shape discovery friction in a blank setup.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): SDK discovery took several probes into the installed package rather than a concise example: the agent first ran `npm view mcp-use version description repository.url dist-tags --json`, then inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/resources.d.ts`, and `node_modules/mcp-use/dist/config.d.ts`. The README mainly pointed onward to external material—`Documentation` at `https://docs.mcp-use.com/v2/typescript/getting-started/welcome` and `Build an MCP server: https://mcp-use.com/prompt.md`—but the transcript shows no fetch of those URLs; the implementation was based on local README/type-declaration grepping, including `rg -n "resource|listen|http|Streamable"` and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`.
