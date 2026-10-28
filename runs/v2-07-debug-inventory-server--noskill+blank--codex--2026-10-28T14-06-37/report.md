# mcp-use SDK agentic eval — 2026-10-28

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-28T14-06-37` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m06s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 493231 / 4153
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair itself was straightforward after inspecting the scaffold: the source explicitly marked `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` SDK discovery required installing dependencies because `find: ‘node_modules/mcp-use’: No such file or directory`; the agent then leaned on grepping installed package declarations with `rg -n "class MCPServer|listen\\(|streamable|transport" node_modules/mcp-use` rather than a skill file or fetched documentation.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct: the agent identified that “`error cases throw, reservations add stock, and restocks update a discarded copy`,” then corrected those localized bugs in `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent lost minor time to brittle inspection commands. The first combined project scan ended with `fatal: not a git repository (or any of the parent directories): .git`, while the next dependency check returned `debug-inventory-server@ . └── (empty)` with exit code 1. It then had to run `npm install`, which took `18s` and reported `5 high severity vulnerabilities` plus an `esbuild@0.28.2` install-script warning.
