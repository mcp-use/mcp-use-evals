# mcp-use SDK agentic eval — 2026-09-21

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-21T14-08-14` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 353825 / 3941
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent correctly localized the behavioral bugs early—`error cases currently throw, reservations increase stock, and restocks update a discarded copy`—but spent extra time confirming startup behavior by installing dependencies and grepping SDK declarations after finding `node_modules absent`. It leaned on `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/config.d.ts`, including the declaration comment `await server.listen(3000);`, rather than a skill file or fetched docs.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was straightforward because the scaffold explicitly marked both mutation defects: `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` The agent fixed these directly in `src/server.ts` with `inventory.set(sku, available - quantity)` and `inventory.set(sku, available + quantity)`, while replacing thrown expected errors with responses such as `return result(\`SKU ${sku} not found\`)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was direct after inspecting `src/server.ts`: the scaffold explicitly exposed the mutation bugs with comments such as `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.`
