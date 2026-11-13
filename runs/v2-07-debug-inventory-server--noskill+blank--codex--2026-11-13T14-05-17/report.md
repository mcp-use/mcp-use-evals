# mcp-use SDK agentic eval — 2026-11-13

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-13T14-05-17` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 342874 / 3768
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent lost an early turn because its inspection command chained `git status --short` with `&&`; in a non-Git workspace this stopped before displaying the source: `fatal: not a git repository (or any of the parent directories): .git`. It then repeated inspection with `sed -n '1,300p' src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main discovery detour was searching the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`, followed by `npm install`. After installation, the agent relied on grepping package internals rather than a skill file or fetched docs, searching `node_modules/mcp-use` for `"listen\\(|class MCPServer|ListenOptions|streamable|Streamable|port"` and then reading `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/README.md`. This did resolve the listener behavior; the declaration explicitly said, `Options accepted by {@link MCPServer.listen}` and showed `await server.listen(3000);`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery detour was probing the SDK before dependencies existed: `find node_modules/mcp-use ...` failed with `No such file or directory`, after which the agent ran `npm install`. It then leaned on grepping installed SDK internals for API shape via `rg -n "class MCPServer|listen\\(" node_modules/mcp-use`, but the result was a large minified `node_modules/mcp-use/dist/index.js` excerpt rather than useful declarations, and no docs URL or skill file was used.
