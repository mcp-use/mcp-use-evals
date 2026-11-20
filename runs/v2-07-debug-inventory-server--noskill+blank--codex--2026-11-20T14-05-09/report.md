# mcp-use SDK agentic eval — 2026-11-20

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-20T14-05-09` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 11
- Median tool calls: 15
- Median tokens in/out: 468377 / 4188
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair itself was straightforward after inspecting `src/server.ts`: the agent identified that “`errors are thrown instead of returned, reservation moves stock in the wrong direction, and restocks mutate a temporary copy`,” then corrected those behaviors in place.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was trying to inspect the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`. After `npm install`, the agent leaned on installed declarations rather than external docs, grepping `node_modules/mcp-use/dist/server.d.ts` and finding the example `await server.listen(3000);` plus `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The first inspection command was needlessly marked failed because it bundled `git status --short` in a directory where `fatal: not a git repository` was expected, although file discovery succeeded.
