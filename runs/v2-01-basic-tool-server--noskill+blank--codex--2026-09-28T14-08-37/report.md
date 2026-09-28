# mcp-use SDK agentic eval — 2026-09-28

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-28T14-08-37` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m08s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 281804 / 3321
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had some API-discovery friction before implementation, first querying package metadata with `npm view mcp-use version description repository.url dist-tags --json`, then unnecessarily creating a tarball via `npm pack mcp-use --pack-destination /tmp`. It ultimately leaned on the installed SDK documentation and declarations, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and grepping for `listen(`; no external docs URL or skill file was fetched in the visible transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had to discover the SDK API by inspecting installed package declarations rather than using a skill or fetched documentation: it ran `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts` and searched for `listen\(`, `ServerConfig`, and `basePath` across `node_modules/mcp-use/dist/{server,config,tools}.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The run spent noticeable discovery effort inspecting the package before implementation: it queried npm with `npm view mcp-use version description repository.url`, listed the tarball via `npm pack mcp-use --dry-run`, then inspected installed materials with `sed -n '1,240p' node_modules/mcp-use/README.md` and several `dist/*.d.ts` files. It also grepped the README for API examples using `rg 'MCPServer|server.listen|tools/call' node_modules/mcp-use/README.md -n`; no external docs URL or skill file was fetched.
