# mcp-use SDK agentic eval — 2026-08-24

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-24T14-16-08` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m44s
- Median turns: 13
- Median tool calls: 22
- Median tokens in/out: 583743 / 5858
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent spent time discovering the SDK API locally: it inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, and `dist/server.d.ts`, then grepped for `listen(` before concluding that “`MCPServer.listen()` … mounts streamable HTTP at `/mcp`.” This worked, but indicates API-shape discovery friction rather than a direct known path.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had SDK discovery friction and leaned heavily on installed-package inspection rather than a skill file: it queried npm with `npm view mcp-use version description repository.url --json`, then grepped `node_modules/mcp-use/README.md` and declarations for `"streamable|http|createServer|McpServer|tool\\("`. The README example at `node_modules/mcp-use/README.md:105-170` supplied the core `new MCPServer(...)` / `server.tool(...)` shape, while further inspection searched for `"listen\\("` in `node_modules/mcp-use/dist/server.d.ts`; no docs URL was fetched despite discovering `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had some SDK discovery friction: it first fetched npm metadata and the full README with `npm view mcp-use readme --json`, then inspected the installed package using `rg -n "class MCPServer|listen\(|serve\(|streamable|createServer" node_modules/mcp-use` and read `node_modules/mcp-use/dist/server.d.ts`. This inspection successfully revealed that “`The installed SDK provides a native MCPServer.listen() implementation with a /mcp streamable-HTTP endpoint`”; no mcp-use skill file or separately fetched docs URL appears in the transcript.
