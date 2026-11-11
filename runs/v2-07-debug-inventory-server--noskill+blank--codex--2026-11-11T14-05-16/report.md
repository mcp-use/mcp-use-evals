# mcp-use SDK agentic eval — 2026-11-11

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-11T14-05-16` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m15s
- Median turns: 12
- Median tool calls: 13
- Median tokens in/out: 411989 / 3452
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The only notable detour was attempting SDK API discovery before dependencies were installed: grepping `node_modules/mcp-use` failed with `No such file or directory (os error 2)`, after which the agent ran `npm install`, taking `15s`. Once installed, it relied on package internals rather than external documentation, searching `node_modules/mcp-use/dist/server.d.ts` and the bundled README; the declaration clarified that `MCPServer.listen` accepts `ListenOptions` and showed `await server.listen(3000)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was dependency availability: the first SDK inspection failed with `node_modules/mcp-use: No such file or directory`, requiring `npm install` before API investigation could continue. The agent then leaned on installed package internals rather than external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `listen-address.d.ts`, and `README.md`; the declaration exposed `listen(port?: number | undefined, options?: ListenOptions)` and the example `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main detour was attempting SDK discovery before dependencies were installed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install`. Installation itself surfaced ecosystem noise—`5 high severity vulnerabilities` and an allow-scripts warning for `esbuild@0.28.2`—though neither blocked the repair.
