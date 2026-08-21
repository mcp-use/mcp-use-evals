# mcp-use SDK agentic eval — 2026-08-21

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-21T14-13-36` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m23s
- Median turns: 10
- Median tool calls: 12
- Median tokens in/out: 309674 / 4085
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was checking the SDK before dependencies existed: the first grep returned `node_modules/mcp-use: No such file or directory`, after which the agent ran `npm install` and repeated the search. It then leaned on installed declaration files rather than a skill or fetched docs, locating `node_modules/mcp-use/dist/server.d.ts:343: listen(port?: number | undefined...)` and reading the packaged README example `await server.listen(3000);` before retaining `await server.listen();` in `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The agent took a minor discovery detour by probing the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, then ran `npm install` and repeated the search successfully. It ultimately relied on installed SDK declarations rather than a skill file or fetched docs, specifically `node_modules/mcp-use/dist/server.d.ts`, where it found `await server.listen(3000);` and `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): Dependency setup caused avoidable friction: `npm ls` reported `UNMET DEPENDENCY mcp-use@2.0.4` and the first `npx tsc --noEmit` fetched the unrelated package `tsc@2.0.4`, producing `This is not the tsc command you are looking for`; the agent then had to run `npm install`.
