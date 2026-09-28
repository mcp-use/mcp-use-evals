# mcp-use SDK agentic eval — 2026-09-28

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-28T14-08-40` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m16s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 356075 / 4355
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was probing the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`, followed by `npm install`. After installation, the agent relied on grepping SDK declarations rather than external docs, finding `listen(port?: number | undefined, options?: ListenOptions)` and the documented precedence `the argument, PORT, config.port, then 3000`. This confirmed the existing HTTP API shape but was arguably unnecessary because the scaffold already ended with `await server.listen(port);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main time loss was manual MCP probing rather than the repair itself. The first verification sent tool names as JSON-RPC methods, producing four failures: `get_stock ERROR Method not found`, `reserve_stock ERROR Method not found`, and `restock ERROR Method not found`. The agent recognized the protocol mistake—`MCP uses the tools/call method with the tool name inside params`—then restarted `PORT=3100 npx tsx src/server.ts` to rerun from clean state.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was around the listener API. The agent said it was “`checking the installed SDK API so the HTTP listener is configured explicitly for the required port`,” but `node_modules` was initially absent (`ls: cannot access 'node_modules/mcp-use': No such file or directory`), so it had to run `npm install` and grep SDK declarations. It then relied on `node_modules/mcp-use/dist/server.d.ts`, whose example showed `await server.listen(3000);`; despite the stated intent to configure the port explicitly, the final source uses `await server.listen();` (`src/server.ts`), relying on SDK environment/default behavior instead. This worked, but the mismatch suggests uncertainty about whether `PORT` is consumed automatically.
