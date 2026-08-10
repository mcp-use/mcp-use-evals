# mcp-use SDK agentic eval — 2026-08-10

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-10T14-27-13` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m59s
- Median turns: 17
- Median tool calls: 25
- Median tokens in/out: 726339 / 7131
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had substantial API-discovery friction and relied on installed package declarations rather than a skill file or fetched docs: it ran `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts`, searched `node_modules/mcp-use/dist/server.d.ts` for `listen(`, and later inspected `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for the client transport shape.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had notable SDK API-discovery friction: it first queried npm with `npm view mcp-use version description repository.url dist.tarball`, then inspected `node_modules/mcp-use/README.md`, and finally grepped declarations using `rg -n "listen|streamable|node-http|MCPServer|start"` and opened `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts` before implementing the server.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was SDK API discovery: the agent first queried npm with `npm view mcp-use version description repository.url --json`, then inspected `node_modules/mcp-use/README.md`, declaration files including `dist/server.d.ts` and `dist/node-http.d.ts`, and finally grepped implementation files with `rg -n "listen\\(" ...` before concluding that “`The SDK provides a direct MCPServer.listen() streamable-HTTP entry point`.” No skill file or fetched docs URL appears; discovery relied on the installed package.
