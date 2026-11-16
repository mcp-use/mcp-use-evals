# mcp-use SDK agentic eval — 2026-11-16

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-16T14-16-13` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m30s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 288592 / 3749
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The first inspection command unnecessarily failed because it assumed a Git checkout: `fatal: not a git repository (or any of the parent directories): .git`. The agent also searched for SDK internals before dependencies existed—`rg ... node_modules/mcp-use` returned no output—then had to run `npm install`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The agent briefly lost time probing the SDK before dependencies were installed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, then ran `npm install` and successfully inspected `node_modules/mcp-use/dist/server.d.ts`, including the documented `await server.listen(3000);` API. It relied on grepping installed package declarations rather than a skill file or fetched docs, as shown by `rg -n "class MCPServer|listen\\(" node_modules/mcp-use`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was inspecting SDK declarations before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`. The agent recovered by running `npm install`, then leaned on installed SDK sources via `rg -n "class MCPServer|listen\\(" node_modules/mcp-use` and opened `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `README.md` to confirm listener and `PORT` behavior.
