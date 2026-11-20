# mcp-use SDK agentic eval — 2026-11-20

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-20T14-05-09` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m30s
- Median turns: 12
- Median tool calls: 19
- Median tokens in/out: 560911 / 5914
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent some discovery effort validating the SDK API, first querying npm with `npm view mcp-use version description repository.url --json` and reading its README, then grepping installed declarations with `rg -n "listen\(|serve\(|streamable|HTTP|MCPServer" node_modules/mcp-use`. The package declarations provided a concrete fallback example: `createServer(toNodeHandler(server)).listen(3000);`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had API-discovery friction and relied on package inspection rather than a skill file: it queried `npm view mcp-use version description peerDependencies dependencies --json`, then inspected `node_modules/mcp-use/README.md` and grepped for `"streamable|createMcpServer|MCPServer|tool\\("`. It also read SDK declarations directly, including `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `tools.d.ts`, and `node-http.d.ts`; the README surfaced the docs URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but no docs fetch is shown.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main time sink was SDK discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist.tarball`, then inspected package contents and the bundled README via `find node_modules/mcp-use ... && sed -n '1,240p' node_modules/mcp-use/README.md`, and finally grepped declarations for `listen|streamable|serve|create.*Server|MCPServer`. It then read specific type surfaces in `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`, suggesting the installed package declarations were the primary API guide.
