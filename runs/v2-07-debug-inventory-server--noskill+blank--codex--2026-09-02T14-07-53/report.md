# mcp-use SDK agentic eval — 2026-09-02

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-02T14-07-53` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 9
- Median tool calls: 11
- Median tokens in/out: 280251 / 4024
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The first inspection command unnecessarily failed because it chained repository checks in a non-git workspace: `fatal: not a git repository (or any of the parent directories): .git`. This did not derail the repair, but it consumed a tool call before the agent separately inspected `src/server.ts`, `package.json`, and `tsconfig.json`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was trying to inspect the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`. The agent then spent 15 seconds on `npm install` (`added 59 packages ... in 15s`) before successfully grepping SDK declarations, notably `node_modules/mcp-use/dist/server.d.ts:343: listen(port?: number | undefined...)` and reading `node_modules/mcp-use/README.md`; no skill file or external docs URL was used.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was localized and direct: the original source explicitly said `// BUG: a reservation should decrease stock, not increase it.`, while unknown and insufficient cases used `throw new Error(...)`; the final source changed these to returned text and `inventory.set(sku, available - quantity)` (`src/server.ts`).
