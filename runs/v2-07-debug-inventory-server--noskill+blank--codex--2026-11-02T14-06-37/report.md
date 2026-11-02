# mcp-use SDK agentic eval — 2026-11-02

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-02T14-06-37` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 444073 / 4050
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The initial inspection lost a little time by combining file discovery with Git status in a directory without Git metadata, producing `fatal: not a git repository (or any of the parent directories): .git` and marking the command failed despite useful output.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The implementation repair itself was direct: the agent identified that “`errors are thrown instead of returned, reservations move stock in the wrong direction, and restocks update a throwaway copy`,” then changed only `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent initially probed SDK internals before dependencies were installed, receiving `node_modules/mcp-use: No such file or directory`, then ran `npm install`, which took `18s`. It subsequently leaned heavily on installed package declarations rather than a skill file or external docs, inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, README excerpts, package exports, and searching for `class MCPServer|listen\(|streamable|port|transport`.
