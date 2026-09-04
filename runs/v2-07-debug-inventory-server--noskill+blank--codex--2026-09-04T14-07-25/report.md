# mcp-use SDK agentic eval — 2026-09-04

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-04T14-07-25` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m25s
- Median turns: 10
- Median tool calls: 15
- Median tokens in/out: 393436 / 3711
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was around listener configuration: the agent said it was “`checking the installed SDK interface next so the HTTP listener is configured explicitly for PORT`,” then grepped `node_modules/mcp-use` and read `dist/server.d.ts`/`dist/config.d.ts`. The discovered declaration already documented that configured port behavior includes “`neither an explicit port nor PORT is set`,” and the final source simply retained `await server.listen();`, so this investigation added work without requiring an API change.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was that dependencies were initially absent: grepping the SDK returned `node_modules/mcp-use: No such file or directory`, so the agent had to run `npm install --ignore-scripts` before inspecting API shape. It then leaned on installed declarations and README rather than a skill file or fetched docs, searching `class MCPServer|async listen|listen\(` and reading `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/README.md`; the declaration’s example, `await server.listen(3000);`, confirmed the listener API.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was checking SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by `npm install`. After installation, the agent relied on installed declarations rather than a skill file or external docs, grepping `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/config.d.ts` for `MCPServer`, `listen`, and streamable HTTP behavior.
