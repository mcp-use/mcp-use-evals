# mcp-use SDK agentic eval — 2026-10-19

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-19T14-08-28` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m02s
- Median turns: 10
- Median tool calls: 11
- Median tokens in/out: 251810 / 3184
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was checking the SDK before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install` and repeated the search successfully. It then relied on installed declarations rather than a skill file or external docs, grepping `node_modules/mcp-use/dist/server.d.ts` and reading the example `await server.listen(3000);`; no fetched docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was confirming listener/port behavior: the agent explicitly said, `I’m checking the installed SDK’s HTTP listener API so the port behavior remains correct`, then grepped `node_modules/mcp-use` for `listen(`, `PORT`, and `port`, and inspected `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/README.md`, and `node_modules/mcp-use/dist/config.d.ts`. No skill file or external docs URL was used.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent had two avoidable command failures from assuming a Git checkout: the initial inspection stopped at `fatal: not a git repository`, and a later command combined a successful typecheck with `git diff`, producing `exitCode:129` and `warning: Not a git repository`. It therefore repeated `npx tsc --noEmit` in the final command.
