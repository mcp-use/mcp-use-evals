# mcp-use SDK agentic eval — 2026-10-23

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-23T14-08-09` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m24s
- Median turns: 17
- Median tool calls: 28
- Median tokens in/out: 653136 / 6788
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had notable API-discovery friction, first querying npm (`npm view mcp-use version description repository.url dist.tarball`) and reading the packaged README (`sed -n '1,240p' node_modules/mcp-use/README.md`), then grepping declarations for `"listen|serve|streamable|MCPServer|mount"` and inspecting `node_modules/mcp-use/dist/tools.d.ts`, `server.d.ts`, and `config.d.ts`. When startup behavior was unclear, it introspected the runtime implementation with `console.log(s.listen.toString())`; no mcp-use skill file or fetched docs URL appears in the transcript, although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had some SDK discovery friction and relied on installed-package inspection rather than a skill file or fetched docs: it ran `rg -n "streamable|Streamable|MCPServer|createMCP|tool\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and then read `node_modules/mcp-use/README.md` plus `node_modules/mcp-use/dist/server.d.ts`. That exploration included a dead path, `rg: node_modules/mcp-use/dist/server.js: No such file or directory`, before the declaration revealed `listen(port?: number | undefined...)` and documented port precedence.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main time sink was SDK API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then inspected installed package internals via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and grepped declarations for `"listen\\(|serve\\(|streamable|MCPServer"`. This suggests the package README/npm metadata did not immediately provide enough implementation guidance, so the agent relied on `node_modules` type declarations to confirm `listen()` behavior and `PORT` precedence.
