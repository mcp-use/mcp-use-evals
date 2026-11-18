# mcp-use SDK agentic eval — 2026-11-18

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-18T14-04-58` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m20s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 331321 / 3603
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was querying the SDK before dependencies existed: `rg ... node_modules/mcp-use` returned `No such file or directory`, so the agent then ran `npm install` and repeated the search. That search initially surfaced a large minified bundle beginning `node_modules/mcp-use/dist/chunk-GX6PGIEO.js:1`, before the agent narrowed inspection to `node_modules/mcp-use/dist/server.d.ts`, where it found the useful example `await server.listen(3000);`. No skill file or external docs URL was used; the visible SDK-shape resource was the installed package declarations via `sed -n '1,390p' node_modules/mcp-use/dist/server.d.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct: the agent identified that defects were “`localized to state mutation and error handling`” and changed only `src/server.ts`, including shared-map updates such as `inventory.set(sku, available - quantity)` and non-throwing responses such as `return result(\`SKU ${sku} not found\`)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The first inspection command was marked failed because the directory lacked Git metadata: `fatal: not a git repository (or any of the parent directories): .git`; including `git status --short` added avoidable noise despite successfully listing the project files.
