# mcp-use SDK agentic eval — 2026-09-18

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-18T14-07-44` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m35s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 290104 / 4027
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was checking SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by `npm install`. After installation, the agent leaned on package internals rather than an external docs URL or skill file, grepping `node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`, where it found `await server.listen(3000);`; it also opened `node_modules/mcp-use/README.md`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main SDK-discovery cost came from dependencies being absent: the first API-shape search returned `dependencies-missing` and `node_modules/mcp-use: No such file or directory`, prompting `npm install`, which took `12s`. The agent then relied on installed package typings rather than external docs, grepping `node_modules/mcp-use/dist/server.d.ts` and `config.d.ts` for `class MCPServer` and `listen(`; this surfaced `listen(port?: number | undefined, options?: ListenOptions)` and documentation that the port fallback applies when neither an explicit port nor `PORT` is set.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The run was mostly direct, but the initial inspection command unnecessarily failed because it included `git status --short` in a directory where `fatal: not a git repository (or any of the parent directories): .git`; this did not block subsequent work.
