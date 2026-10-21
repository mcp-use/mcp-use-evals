# mcp-use SDK agentic eval — 2026-10-21

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-21T14-08-01` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m21s
- Median turns: 10
- Median tool calls: 15
- Median tokens in/out: 630783 / 5337
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair was straightforward because the scaffold explicitly marked both state bugs: `// BUG: a reservation should decrease stock, not increase it.` and `// BUG: this copy is discarded after the call, so restocks are not shared.` The agent corrected these directly in `src/server.ts` with `inventory.set(sku, available - quantity)` and `inventory.set(sku, available + quantity)`, while replacing thrown business errors with results such as `return result(\`SKU ${sku} not found\`)` and `return result("insufficient stock")`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command unnecessarily included Git status and therefore reported failure in a non-Git scaffold: `fatal: not a git repository (or any of the parent directories): .git`. A second bundled inspection also exited unsuccessfully (`"exitCode":1`) because it checked dependencies before installation with `test -d node_modules`, although it still exposed the source and configuration.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was direct: the agent identified that error paths “`currently throw, reservations move stock in the wrong direction, restocks update a discarded copy`,” then made the corresponding small in-place changes.
