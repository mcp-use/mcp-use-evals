# mcp-use SDK agentic eval — 2026-09-25

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-25T14-08-27` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m31s
- Median turns: 11
- Median tool calls: 13
- Median tokens in/out: 339513 / 4004
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The repair itself was direct, but SDK discovery required installing dependencies after `rg: node_modules/mcp-use: IO error ... No such file or directory`; the agent then leaned on package declarations via `node_modules/mcp-use/dist/server.d.ts:343: listen(port?: number | undefined, options?: ListenOptions)` and the bundled example `await server.listen(3000);`, rather than a skill file or fetched docs URL.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery friction was that dependencies were not installed: the first SDK search returned `node_modules/mcp-use: No such file or directory`, forcing an `npm install` that took `18s`. The agent then leaned on grepping `node_modules` rather than a skill file or fetched docs, first hitting noisy bundled output from `node_modules/mcp-use/dist/index-node.js:1`, then narrowing to declarations where `node_modules/mcp-use/dist/server.d.ts:343` showed `listen(port?: number | undefined, options?: ListenOptions)`. This was useful but somewhat circuitous for confirming how to honor `PORT`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was probing SDK files before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, followed by an `npm install` that took `18s`. After installation, the agent leaned on local SDK internals rather than external docs, grepping `node_modules/mcp-use` for `"class MCPServer|listen\\(|streamable|transport"` and then reading `node_modules/mcp-use/dist/server.d.ts`; the useful declaration explicitly showed `await server.listen(3000)`.
