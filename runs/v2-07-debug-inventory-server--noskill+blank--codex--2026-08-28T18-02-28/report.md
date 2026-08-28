# mcp-use SDK agentic eval — 2026-08-28

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-28T18-02-28` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m12s
- Median turns: 10
- Median tool calls: 13
- Median tokens in/out: 363544 / 4087
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was querying the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by `npm install` and a second search. The agent then relied on installed package internals rather than external docs or a skill file, grepping `node_modules/mcp-use` for `"listen\\(|streamable|Streamable|transport"` and reading `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `README.md`; the declaration’s example, `await server.listen(3000);`, confirmed the listener API.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The run was mostly direct: the existing file explicitly marked both mutation bugs with `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` The agent also correctly identified thrown domain errors from lines such as `throw new Error("insufficient stock")`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The first inspection command lost a turn because `git status --short` ran in a non-git workspace and stopped the chained command: `fatal: not a git repository (or any of the parent directories): .git`; the agent then reran the file inspection separately.
