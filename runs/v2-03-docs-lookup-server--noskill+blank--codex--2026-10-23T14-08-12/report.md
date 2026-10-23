# mcp-use SDK agentic eval — 2026-10-23

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-23T14-08-12` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m24s
- Median turns: 14
- Median tool calls: 23
- Median tokens in/out: 657968 / 5252.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had substantial API-discovery friction and relied on installed-package internals rather than a skill file or external docs: it inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`, then stated, `The SDK provides first-class static and templated resource registration plus a Streamable HTTP listener`. One inspection command itself failed with `exitCode":2`, and client verification required several more searches through `node_modules/@modelcontextprotocol/client`, including `rg -n "StreamableHTTPClientTransport"` and declaration-file excerpts.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had to discover the SDK shape by grepping installed package materials rather than using a skill or fetched docs: `rg -n "streamable|resource\(|tool\(|MCPServer|McpServer|createMCP" node_modules/mcp-use/README.md node_modules/mcp-use/dist`. It then inspected declarations directly, including `node_modules/mcp-use/dist/resources.d.ts`, `tools.d.ts`, and `server.d.ts`, suggesting the README quickstart alone did not cover resource templates and listening APIs.
