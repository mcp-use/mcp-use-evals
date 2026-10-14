# mcp-use SDK agentic eval — 2026-10-14

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-14T14-07-37` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m15s
- Median turns: 10
- Median tool calls: 11
- Median tokens in/out: 266994 / 3259
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was attempting to inspect the installed SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by `npm install`, which took `19s`. After installation, the agent relied on grepping SDK internals and declarations rather than a skill file or fetched docs, including `node_modules/mcp-use/dist/server.d.ts` and its example `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The run was mostly direct, but discovery incurred avoidable friction because the agent searched the SDK before installing dependencies: `rg: node_modules/mcp-use: IO error ... No such file or directory`. It then ran `npm install` and repeated the same grep successfully against `node_modules/mcp-use`, including `dist/server.d.ts`, `dist/config.d.ts`, and `README.md`; the declaration explicitly confirmed `await server.listen(3000);`. No mcp-use skill file or external docs URL was used.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was inspecting the SDK before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install`. It then leaned on grepping `node_modules` for the API shape—`rg -n "class MCPServer|listen\(|Streamable"`—and inspected `node_modules/mcp-use/dist/server.d.ts`, where the listener documentation states `Port precedence is the argument, PORT, config.port, then 3000`. One attempted declaration-file path was wrong: `sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory`; the available declarations were instead listed under files such as `server.d.ts` and `config.d.ts`.
