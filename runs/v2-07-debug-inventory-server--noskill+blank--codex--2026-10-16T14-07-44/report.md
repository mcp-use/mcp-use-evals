# mcp-use SDK agentic eval — 2026-10-16

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-16T14-07-44` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 307077 / 4409
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The first inspection attempt was wasted because `git status --short && ...` stopped the chained command in a non-Git directory with `fatal: not a git repository`, so package and tsconfig inspection had to be retried separately.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The repair itself was direct: the agent identified that the server “`throws for expected conditions, increments on reserve, and restocks a temporary copy`,” then changed only `src/server.ts`. Some discovery time was lost by searching dependencies before installing them; the first SDK inspection returned `find: ‘node_modules/mcp-use’: No such file or directory`, after which it ran `npm install`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was inspecting SDK internals before dependencies existed: the first grep returned `node_modules/mcp-use: No such file or directory`, after which the agent ran `npm install`. It then relied on installed declaration files rather than a skill file or fetched docs, grepping `node_modules/mcp-use/dist/server.d.ts` and `config.d.ts` for `class MCPServer`, `listen(`, `PORT`, and streamable HTTP behavior. This was somewhat broader than necessary because the existing scaffold already ended with `await server.listen();` and used `MCPServer` from `"mcp-use"` (`src/server.ts`).
