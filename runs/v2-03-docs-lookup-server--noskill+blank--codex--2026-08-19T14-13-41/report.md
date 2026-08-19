# mcp-use SDK agentic eval — 2026-08-19

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-19T14-13-41` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 20
- Median tool calls: 26
- Median tokens in/out: 807163 / 6869
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had API-discovery friction and leaned heavily on the installed package rather than a skill or external docs: it first ran `npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. The declaration-file comment for `listen` supplied key transport guidance: `Serve over HTTP on Node. Pass port \`0\` for an ephemeral port.`
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs: it ran `sed -n '1,260p' node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `config.d.ts`, and `tools.d.ts` to discover the registration and `listen` APIs. This worked, but required several exploratory calls, including `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had substantial API-discovery friction and leaned on the installed package rather than a skill file or external docs: it opened `node_modules/mcp-use/README.md`, then inspected `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts` with commands such as `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist -g '*.d.ts'`. It also searched minified runtime code for the listen and telemetry APIs via `rg -n "async listen|listen\\(" node_modules/mcp-use/dist/index-node.js node_modules/mcp-use/dist/chunk-*.js`.
