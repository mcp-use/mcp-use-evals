# mcp-use SDK agentic eval — 2026-09-11

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-11T14-08-04` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 12
- Median tool calls: 13
- Median tokens in/out: 340582 / 4184
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was that dependencies were absent: `npm ls --depth=0` reported `UNMET DEPENDENCY mcp-use@2.0.4` and the agent had to run `npm install`, which took `14s`, before SDK inspection or validation could proceed. Its first SDK grep therefore returned no output: `rg -n "class MCPServer|listen... node_modules/mcp-use"` produced `output":""`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command was unnecessarily marked failed because it bundled repository status with file discovery in a directory that was not a Git checkout: `fatal: not a git repository (or any of the parent directories): .git`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent’s first inspection command unnecessarily failed because it appended `git status --short` in a directory where `fatal: not a git repository`, although the file listing still succeeded. SDK API discovery required installing dependencies (`npm install`) and then grepping package internals with `rg -n "listen\\(|streamable|Streamable|port|tool\\(" node_modules/mcp-use`; it specifically consulted `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/README.md`, where the listener example showed `await server.listen(3000);`. No mcp-use skill file or external docs URL was used in the visible transcript.
