# mcp-use SDK agentic eval — 2026-10-07

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-07T14-07-30` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m25s
- Median turns: 13
- Median tool calls: 15
- Median tokens in/out: 525291 / 4752
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was that the agent tried inspecting the SDK before dependencies existed and got `node_modules/mcp-use: No such file or directory`; it then ran `npm install`, which took `17s`. It relied on grepping `node_modules` for API shape—`rg -n "class MCPServer|interface.*Listen|listen\\("`—and ultimately found the useful port behavior in `node_modules/mcp-use/dist/config.d.ts`: `TCP port listen() binds when neither an explicit port nor PORT is set.` The first grep produced a large minified bundle beginning `node_modules/mcp-use/dist/mcp-proxy-NETCUGUD.js:2`, so targeting declaration files earlier would have reduced noise.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The agent had to discover the listener API from the installed package rather than project guidance, first grepping bundled output with `rg -n "listen\(|class MCPServer..." node_modules/mcp-use/dist`, then reading `node_modules/mcp-use/dist/server.d.ts`; the useful declaration only exposed `ListenOptions` with `host?: string`, while its example showed `await server.listen(3000)`. The final source relies on implicit environment handling—`// mcp-use resolves PORT before this configured fallback.` followed by `await server.listen();`—which suggests a non-obvious SDK behavior around `PORT` and defaults.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was that the agent tried inspecting the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`, then had to run `npm install`. It subsequently leaned on installed SDK declarations and README rather than a skill file, including `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/README.md`, where it confirmed `await server.listen(3000);` and the documented port precedence: `the argument, PORT, config.port, then 3000`.
