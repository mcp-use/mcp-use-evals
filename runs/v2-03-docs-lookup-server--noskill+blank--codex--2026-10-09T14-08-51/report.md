# mcp-use SDK agentic eval — 2026-10-09

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-09T14-08-51` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m51s
- Median turns: 20
- Median tool calls: 28
- Median tokens in/out: 1170261 / 8063
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than docs: it inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`, then searched for listener signatures with `rg -n "async listen|listen\\("`. Its initial npm README lookup failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, creating avoidable discovery friction.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had SDK discovery friction: `npm view mcp-use readme --json` yielded no README content, so it inspected package internals with `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "listen|resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. No mcp-use skill file or external docs URL was used; the transcript instead shows direct inspection of `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, and `tools.d.ts`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had discovery friction because registry documentation was unavailable: both `npm view mcp-use readme --json` and `npm view mcp-use readme | head -200` returned empty output. It compensated by grepping installed package files for API shape—`rg -n "Streamable|streamable|resource\(|tool\(|MCPServer"`—and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`.
