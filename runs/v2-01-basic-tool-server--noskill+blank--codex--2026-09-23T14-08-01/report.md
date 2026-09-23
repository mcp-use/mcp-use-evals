# mcp-use SDK agentic eval — 2026-09-23

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-23T14-08-01` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m30s
- Median turns: 11
- Median tool calls: 15
- Median tokens in/out: 413163 / 3411
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent notable discovery time on API shape rather than relying on prior guidance: it fetched npm metadata and the package README with `npm view mcp-use readme --json`, then inspected installed declarations via `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts` and searched implementation files with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. One inspection command took a wrong turn and exited 2 after requesting apparently unavailable files: `sed -n '1,260p' node_modules/mcp-use/dist/index-node.d.ts` and `sed -n '1,260p' node_modules/mcp-use/dist/node-http.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery in the blank directory: after confirming the workspace contained only `total 8` and no source files, the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and fetched the package README via `npm view mcp-use readme --json`. It then relied on installed declaration files rather than a skill or fetched docs page, searching `node_modules/mcp-use/dist` for `"listen\\(|serve|streamable|HTTP|express"` and inspecting `node_modules/mcp-use/dist/server.d.ts`, where it found `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description readme --json`, then inspected the installed package via `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts` and searched declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. This indicates it leaned on the npm README and grepping `node_modules` for the `MCPServer`/`listen()` shape rather than fetching the linked documentation URL, although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
