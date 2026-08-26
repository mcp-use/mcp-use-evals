# mcp-use SDK agentic eval — 2026-08-26

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-26T14-17-02` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m06s
- Median turns: 10
- Median tool calls: 13
- Median tokens in/out: 315963 / 3633
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The first inspection lost a turn because `git status --short` was chained with `&&` in a directory where `fatal: not a git repository`, so the command stopped before printing the source and required a second inspection command.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): SDK discovery initially failed because dependencies were absent: `rg: node_modules/mcp-use: IO error ... No such file or directory`. After `npm install`, the agent relied on grepping package declarations—`rg -n "listen\(|streamable|port|transport" node_modules/mcp-use`—and inspected `node_modules/mcp-use/dist/server.d.ts`, which directly documented `await server.listen(3000);`. No skill file or external docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent hit avoidable discovery friction by grepping the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, then had to run `npm install`. It relied on installed package declarations rather than a skill file or external docs, searching `node_modules/mcp-use/dist/server.d.ts` and `config.d.ts`; the useful API evidence was `listen(port?: number | undefined...)` and the config note that the port uses `PORT`.
