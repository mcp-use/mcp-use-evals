# mcp-use SDK agentic eval — 2026-08-19

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-19T14-13-33` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 10
- Median tool calls: 15
- Median tokens in/out: 399527 / 3769
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main SDK discovery friction was listener configuration: the agent paused because “`the listener is relying on SDK defaults instead of explicitly binding the required HTTP port`” and inspected installed declarations with `rg -n "listen\\(|streamable|transportType|http" node_modules/mcp-use/dist`; the useful API clue was `node_modules/mcp-use/dist/server.d.ts:343: listen(port?: number | undefined, options?: ListenOptions)`. No skill file or external docs URL was used; the agent leaned on `node_modules/mcp-use/dist/config.d.ts` and `node_modules/mcp-use/dist/server.d.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command was partially derailed by assuming Git metadata existed: `fatal: not a git repository (or any of the parent directories): .git`. SDK discovery also initially failed because dependencies were absent—`find: ‘node_modules/mcp-use’: No such file or directory`—so the agent ran `npm install`, which took `11s`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The run was successful but had minor discovery friction. The first inspection command unnecessarily included Git status in a non-Git workspace, producing `fatal: not a git repository (or any of the parent directories): .git`. SDK API inspection also initially failed because dependencies were absent: `rg: node_modules/mcp-use: IO error ... No such file or directory`; the agent then ran `npm install` and leaned on grepping `node_modules/mcp-use`, finding the declaration example `await server.listen(3000);`. No mcp-use skill file or external docs URL appears in the transcript.
