# mcp-use SDK agentic eval — 2026-10-23

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-23T14-08-16` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m13s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 368809 / 4174
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was grepping the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`; the agent then ran `npm install` before repeating the search. It leaned on installed declaration files rather than a skill file or external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, where the SDK example showed `await server.listen(3000);`, and concluded that bare `listen()` resolves `PORT`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The agent lost time probing dependencies before installation: `npm ls ...` returned `└── (empty)`, and the next search produced `ls: cannot access 'node_modules': No such file or directory`. It then queried the registry with `npm view mcp-use@2.0.4` before eventually running `npm install`, despite the project’s installed version not yet being inspectable.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was straightforward: the agent identified that the server “`throws for expected errors, increments on reserve, and updates a throwaway copy on restock`,” then produced the correct shared-state changes in `src/server.ts`, including `inventory.set(sku, available - quantity)` and `inventory.set(sku, available + quantity)`.
