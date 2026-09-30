# mcp-use SDK agentic eval — 2026-09-30

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-30T14-08-48` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m44s
- Median turns: 13
- Median tool calls: 16
- Median tokens in/out: 467104 / 4566
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was that dependencies were initially absent: `find: ‘node_modules/mcp-use’: No such file or directory`, so the agent had to run `npm install` before inspecting the SDK. It then leaned on installed package sources rather than a skill file or external docs, grepping `node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`, where it found `await server.listen(3000);` and the signature `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The main time sink was dependency/API discovery: the agent first tried grepping an uninstalled SDK and got `node_modules/mcp-use: No such file or directory`, then `npm install` failed on `source-map-js-1.2.2.tgz` with `404 Not Found`. It worked around this by querying npm metadata (`npm view mcp-use@2.0.4 dependencies --json`), downloading the package (`npm pack mcp-use@2.0.4`), and extracting `package/dist/server.d.ts` plus `package/README.md`; no mcp-use skill file or fetched docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main friction was dependency/API discovery: the first grep failed because dependencies were absent—`rg: node_modules/mcp-use: IO error ... No such file or directory`—so the agent ran `npm install` and then inspected `node_modules/mcp-use/dist/server.d.ts`. That declaration supplied the key listener behavior: `Port precedence is the argument, PORT, config.port, then 3000`, allowing the existing `await server.listen();` to remain unchanged. No skill file or external docs URL was used; the transcript shows direct grepping of `node_modules`.
