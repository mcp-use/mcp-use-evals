# mcp-use SDK agentic eval — 2026-08-17

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-17T14-08-42` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 11
- Median tool calls: 13
- Median tokens in/out: 333339 / 4167
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main time sink was dependency setup: the first `npx tsc --noEmit` fetched the unrelated deprecated `tsc@2.0.4` and failed with `This is not the tsc command you are looking for`. The agent then inferred that `Dependencies are not installed in this checkout` and ran `npm install --no-package-lock`, which added `59 packages` before typechecking could proceed.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was querying the SDK before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install`. It then relied on installed package internals rather than a skill file or external docs, grepping `node_modules/mcp-use/dist/server.d.ts` and reading `node_modules/mcp-use/README.md`; the declaration’s example explicitly showed `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was direct: the agent identified that unknown SKUs used `throw new Error`, reservations used `inventory.set(sku, available + quantity)`, and restocking modified `const localInventory = new Map(inventory)`, then corrected those behaviors in place.
