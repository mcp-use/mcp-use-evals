# mcp-use SDK agentic eval — 2026-08-10

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-10T14-27-05` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m13s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 436324 / 4001
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and `npm view mcp-use readme`, then inspected installed package internals via `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`. The decisive guidance came from the declaration comment: `Port precedence is the argument, PORT, config.port, then 3000`, which justified the minimal `await server.listen()` implementation.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery: after `npm view mcp-use readme --json` yielded no README content, the agent installed the package and explored local artifacts with `find node_modules/mcp-use`, then read `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/node-http.d.ts`, `dist/tools.d.ts`, `dist/server.d.ts`, and `dist/config.d.ts`. It even searched bundled implementation files with `rg -n "async listen|listen\\(" node_modules/mcp-use/dist/index-node.js node_modules/mcp-use/dist/chunk-*.js`, suggesting the basic server/listen API was not immediately obvious from package metadata.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had API-discovery friction and leaned heavily on the installed package rather than prior guidance: it said it would check “`the mcp-use API available from npm`,” queried `npm view mcp-use`, then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, and `node-http.d.ts`. This ultimately revealed that “`The SDK’s built-in listen method provides the streamable HTTP endpoint at /mcp`,” but required several broad `find`, `sed`, and `rg` calls over package internals.
