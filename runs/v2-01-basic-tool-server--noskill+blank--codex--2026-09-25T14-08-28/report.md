# mcp-use SDK agentic eval — 2026-09-25

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-25T14-08-28` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m25s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 500833 / 4063
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery friction was that the registry README lookup returned nothing: `npm view mcp-use readme | sed -n '1,260p'` produced `output":""`. The agent then inspected the package tarball with `npm pack mcp-use --dry-run --json`, installed it, and leaned on local package documentation and declarations: `sed -n '1,260p' node_modules/mcp-use/README.md`, `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`, and `sed -n '1,180p' node_modules/mcp-use/dist/index.d.ts`. No mcp-use skill file or fetched docs URL appears in the transcript; the README merely exposed the link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent notable time discovering the API from the package itself: it first queried `npm view mcp-use ...`, ran `npm pack mcp-use --dry-run --json`, then inspected `node_modules/mcp-use/README.md` and declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. This suggests the blank setup required package-level exploration before the simple server shape was clear; the useful declaration documented that `listen(port?)` returns the actual `port` and endpoint `url` in `node_modules/mcp-use/dist/server.d.ts:363`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the API from the installed package rather than from readily surfaced README guidance: it inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`, then relied on the declaration that “`Port precedence is the argument, PORT, config.port, then 3000`.” Its initial `npm view mcp-use readme --json` produced no README content beyond package metadata, prompting this deeper inspection.
