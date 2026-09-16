# mcp-use SDK agentic eval — 2026-09-16

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-16T14-08-07` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 372430 / 4216
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The agent briefly lost time by assuming Git metadata existed: the first inspection ended with `fatal: not a git repository (or any of the parent directories): .git`. It then leaned on the installed SDK rather than a skill file or fetched docs, running `rg -n "class MCPServer|listen\(|Streamable|streamable|transport" node_modules/mcp-use`; this produced a largely minified `node_modules/mcp-use/dist/index.js` hit, while the follow-up inspection of `dist/index.d.ts` and `dist/node-bridge.d.ts` returned an empty `output`, so SDK discovery was somewhat noisy and uninformative.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The initial repository-inspection command unnecessarily failed because it included `git status --short` in a non-Git workspace, yielding `fatal: not a git repository (or any of the parent directories): .git`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The repair itself was localized, but SDK discovery cost several calls. The agent first searched before dependencies existed and hit `rg: node_modules/mcp-use: IO error ... No such file or directory`, then ran `npm install`. It subsequently leaned heavily on installed package internals, searching `node_modules/mcp-use/dist/server.d.ts`, `dist/index.js`, and the package README for `MCPServer` and `listen`; one lookup still failed with `exitCode":1,"output":""`. The declaration’s example, `await server.listen(3000);`, did not directly document the desired environment-driven no-argument behavior, while the final source relied on `// With no explicit argument, mcp-use reads PORT and defaults to 3000.`
