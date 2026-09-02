# mcp-use SDK agentic eval — 2026-09-02

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-02T14-07-54` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 14
- Median tool calls: 23
- Median tokens in/out: 788741 / 6698
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape directly from the installed package, inspecting `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`; it then concluded that “`The installed SDK provides native static and templated resource registration plus a listen() method`.” No skill file or external docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than a skill or fetched mcp-use docs, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, and `node_modules/mcp-use/dist/server.d.ts` after `npm view mcp-use readme --json` yielded no useful README content in the shown output.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had to discover the SDK API from the installed package rather than an existing scaffold, first querying npm with `npm view mcp-use version description repository.url`, then grepping package internals via `rg -n "Streamable|streamable|resource\\(|tool\\(|createMCP|MCPServer|McpServer" node_modules/mcp-use`. It relied specifically on `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts` to determine constructor, tool, resource, template, and listening shapes.
