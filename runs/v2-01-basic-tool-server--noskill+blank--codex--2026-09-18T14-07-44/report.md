# mcp-use SDK agentic eval — 2026-09-18

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-18T14-07-44` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 17
- Median tool calls: 21
- Median tokens in/out: 491419 / 4253
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent hit documentation-discovery friction immediately: `npm view mcp-use readme --json` produced an empty file, confirmed by `0 /tmp/mcp-use-readme.json`. It then relied on the installed package itself, grepping `node_modules/mcp-use/README.md` and inspecting `node_modules/mcp-use/dist/server.d.ts`; the latter supplied the key usage example `await server.listen(3000);` and documented port precedence as “the argument, `PORT`, `config.port`, then `3000`.”
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had API-discovery friction and leaned heavily on the installed package rather than prior guidance: it ran `rg -n "Streamable|streamable|tool\\(|createMCP|MCPServer|McpServer" node_modules/mcp-use` and then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/tools.d.ts`. The initial `npm view mcp-use readme --json` did not yield README content in the shown output, so local package inspection supplied the usable quickstart and `listen()` signature, including `node_modules/mcp-use/dist/server.d.ts:362: listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm and fetched the GitHub README (`npm view mcp-use readme --json`, `curl .../typescript/README.md`), then attempted an example URL that failed with `exitCode":22`. It ultimately relied on grepping installed package internals—`rg -n "listen\\(|streamable|serve|createServer|MCPServer" node_modules/mcp-use`—and inspecting `node_modules/mcp-use/dist/server.d.ts`, where the `listen(port?)` signature and port precedence were documented. No mcp-use skill was used; the fetched prompt merely instructed `Install the mcp-use skill`, but the agent proceeded through package declarations instead.
