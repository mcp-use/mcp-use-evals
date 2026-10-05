# mcp-use SDK agentic eval — 2026-10-05

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-05T14-10-35` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m03s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 458503 / 4102
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair itself was direct: the agent identified that “`unknown-SKU paths throw, reservations add instead of subtract, and restocks mutate a temporary copy`,” then corrected those localized defects in `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was checking SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`, followed by `npm install`. After installation, the agent relied on grepping `node_modules` and reading `node_modules/mcp-use/dist/server.d.ts`; the declaration’s example showed `await server.listen(3000)`, while the agent concluded that “`listen()` resolves `PORT` itself and defaults to 3000” and retained `await server.listen();` in `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was querying the SDK before dependencies existed: `rg ... node_modules/mcp-use` returned `No such file or directory`, requiring a subsequent `npm install` that took `12s`. After installation, the agent relied on grepping and reading package declarations rather than a skill file or external docs, including `node_modules/mcp-use/dist/server.d.ts`; this exposed the needed behavior directly: `Port precedence is the argument, PORT, config.port, then 3000`. That allowed it to preserve the simple entrypoint `await server.listen();` without adding manual environment parsing.
