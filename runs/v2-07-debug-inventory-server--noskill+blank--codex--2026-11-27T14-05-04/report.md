# mcp-use SDK agentic eval — 2026-11-27

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-27T14-05-04` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m07s
- Median turns: 11
- Median tool calls: 14
- Median tokens in/out: 320780 / 4114
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent lost a little time assuming repository and dependency state: its first compound inspection stopped at `fatal: not a git repository`, and its first SDK search returned `node_modules/mcp-use: No such file or directory`. It recovered by running `npm install`, but that introduced lockfile churn that it later reversed via `fileChange({"event":"delete","path":"package-lock.json"})`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was checking SDK internals before dependencies existed: `rg ... node_modules/mcp-use` failed with `No such file or directory`, after which the agent ran `npm install` and repeated the search successfully. It then leaned on the installed package rather than external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md` to confirm `listen`/port behavior; the declaration explicitly showed `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was checking SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`, followed by `npm install`. After installation, the agent leaned on local package internals rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md`; the declaration clarified that `MCPServer.listen` has “`Explicit bind host; takes precedence over HOST and configured host.`”
