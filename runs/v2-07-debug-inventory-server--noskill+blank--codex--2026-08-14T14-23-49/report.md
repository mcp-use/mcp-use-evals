# mcp-use SDK agentic eval — 2026-08-14

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-14T14-23-49` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 11
- Median tool calls: 14
- Median tokens in/out: 361626 / 3808
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was checking SDK internals before dependencies existed: the first search failed with `node_modules/mcp-use: No such file or directory`, after which the agent ran `npm install` and repeated the search. It then relied on installed package declarations and README rather than external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md`; the declarations exposed that `listen(port?: number...)` supports an optional port and that configured behavior considers `PORT`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was checking SDK internals before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install` and repeated the search. It then leaned on installed package artifacts rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `listen-address.d.ts`, and `node_modules/mcp-use/README.md`; the declaration clarified that `MCPServer.listen` supports HTTP and showed `await server.listen(3000)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was that dependencies were initially absent, so the first SDK inspection failed with `node_modules/mcp-use: No such file or directory`; the agent then ran `npm install` before grepping `node_modules/mcp-use/dist/server.d.ts` for `MCPServer` and `listen(port?: number...)`. It relied on installed package declarations and `node_modules/mcp-use/README.md`, rather than a skill file or fetched docs URL, as shown by `sed -n '1,390p' node_modules/mcp-use/dist/server.d.ts` and `rg ... node_modules/mcp-use/README.md`.
