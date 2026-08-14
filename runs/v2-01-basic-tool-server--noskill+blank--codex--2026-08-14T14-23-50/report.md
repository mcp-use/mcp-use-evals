# mcp-use SDK agentic eval — 2026-08-14

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-14T14-23-50` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 15
- Median tool calls: 21
- Median tokens in/out: 665384 / 3458
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): API discovery involved several package-inspection steps before implementation: the agent fetched npm metadata and the full README with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then inspected installed declarations via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched implementation files with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. This suggests the README alone did not immediately provide enough concrete API shape for `MCPServer.tool` and `listen`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had discovery friction around the SDK API, first querying npm with `npm view mcp-use version description repository.url dist.tarball --json` and the package README, then inspecting installed declarations via `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts`. The declarations ultimately supplied the crucial port behavior: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent relied on npm metadata and installed declarations rather than a skill file: it queried `npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, and grepped `rg -n "listen\\("`. This was effective, but indicates API discovery required digging into package internals.
