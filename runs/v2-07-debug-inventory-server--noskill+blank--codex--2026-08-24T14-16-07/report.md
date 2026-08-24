# mcp-use SDK agentic eval — 2026-08-24

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-24T14-16-07` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m23s
- Median turns: 10
- Median tool calls: 15
- Median tokens in/out: 438463.5 / 4144.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was checking the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`. The agent then ran `npm install`, which took `14s`, and relied on grepping installed declarations rather than a skill file or fetched documentation: `node_modules/mcp-use/dist/server.d.ts:343:    listen(port?: number | undefined, options?: ListenOptions)`. That declaration also supplied a directly relevant example, `await server.listen(3000);`, so API-shape discovery was straightforward once installation completed.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main avoidable detour was probing an uninstalled dependency: the first SDK search failed with `node_modules/mcp-use: No such file or directory`, after which the agent ran `npm install` and repeated the search. It then relied on installed package declarations and README rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/README.md`; the declaration exposed `listen(port?: number | undefined, options?: ListenOptions)`.
