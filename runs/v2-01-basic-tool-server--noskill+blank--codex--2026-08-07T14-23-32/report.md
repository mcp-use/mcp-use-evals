# mcp-use SDK agentic eval — 2026-08-07

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-07T14-23-32` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m08s
- Median turns: 15
- Median tool calls: 18
- Median tokens in/out: 467730 / 3724
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had to discover the API from the installed package because npm metadata returned an empty README (`"readme": ""`); it then inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`, including grepping for `"listen\\("`. No external docs URL or skill file was used in the visible transcript, although the package README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had some API-discovery friction: it first queried npm with `npm view mcp-use readme --json`, then relied on installed-package internals via `sed -n '1,240p' node_modules/mcp-use/README.md`, `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. No mcp-use skill file or fetched docs page appears; the README only pointed toward `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url dist.tarball --json`, then inspected the package tarball via `npm pack mcp-use@2.0.4 --dry-run`, and finally read installed SDK files with `sed -n '1,260p' node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist/server.d.ts`. It further grepped declarations and implementation for the server API using `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts` and `rg -n "PORT|listen\\(" node_modules/mcp-use/dist/index-node.js`, suggesting the required HTTP/listen shape was not immediately known from the initial package metadata.
