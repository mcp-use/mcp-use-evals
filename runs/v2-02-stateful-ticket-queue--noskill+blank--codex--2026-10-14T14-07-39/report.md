# mcp-use SDK agentic eval — 2026-10-14

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-14T14-07-39` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m54s
- Median turns: 18
- Median tool calls: 28
- Median tokens in/out: 1016050 / 7324
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had discovery friction around the SDK API and leaned heavily on installed-package internals: it first queried npm with `npm view mcp-use version description repository.url dist.tarball --json`, then inspected `node_modules/mcp-use/README.md`, searched declarations using `rg -n "listen|serve|port|streamable|MCPServer"`, and opened `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`. No docs URL or skill file appears in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main friction was API discovery: after `npm view mcp-use readme --json` yielded no useful README content, the agent inspected package internals with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched for `listen`, `streamable`, and HTTP APIs. It similarly had to grep `@modelcontextprotocol/client` declarations for `StreamableHTTPClientTransport`, `Client`, `listTools()`, and `callTool()` before constructing its lifecycle test. No mcp-use skill file or external docs URL was used.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs, first running `npm view mcp-use version description repository.url --json`, then grepping `node_modules/mcp-use` for `"streamable|Streamable|create.*Server|McpServer|tool\\("`, and finally reading `README.md`, `server.d.ts`, exports, and `listen()` declarations.
