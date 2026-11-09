# mcp-use SDK agentic eval — 2026-11-09

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-09T14-05-26` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 452311 / 5847
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was documentation availability: fetching the repository README failed with `curl: (22) The requested URL returned error: 404`. The agent recovered by inspecting the installed package directly, using `sed -n '1,460p' node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/resources.d.ts`, and `node_modules/mcp-use/dist/index.d.ts` to determine the APIs for resources, templates, tools, and listening. No mcp-use skill file was used; the transcript instead shows `npm view mcp-use ...`, the failed GitHub fetch, and node_modules inspection.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had discovery friction because the blank project provided no guidance, so it queried npm (`npm view mcp-use version description repository.url --json`) and then inspected installed declarations with `rg -n "streamable|resource\\(|addResource|McpServer|createMcp" node_modules/mcp-use` plus `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`. This successfully exposed the SDK’s `MCPServer`, resource, template, and listen APIs, but required several exploratory calls rather than a direct example or skill file.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main friction was SDK/API discovery: the agent first queried npm metadata with `npm view mcp-use readme --json`, then inspected installed declarations via `rg -n "resource\\(|listen|streamable|MCPServer"` and `sed` on `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, and `tools.d.ts`. No skill file or external docs URL was used; the run leaned primarily on package README/type declarations.
