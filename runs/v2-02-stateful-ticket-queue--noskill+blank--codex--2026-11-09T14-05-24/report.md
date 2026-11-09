# mcp-use SDK agentic eval — 2026-11-09

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-09T14-05-24` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m03s
- Median turns: 19
- Median tool calls: 24
- Median tokens in/out: 603281 / 5663
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had discovery friction because `npm view mcp-use readme --json` returned an empty output, so it inspected installed package internals instead: `rg -n "streamable|Streamable|MCPServer|create.*server|tool\\(" node_modules/mcp-use` and read `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/tools.d.ts`. It also leaned on the bundled skill/testing guidance at `node_modules/mcp-use/node_modules/@mcp-use/cli/dist/agent-skills/openapi-to-mcp/SKILL.md`, including the recommendation that “`mcp-use client` CLI… is the first thing to reach for.”
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had some SDK discovery friction and relied on installed package internals rather than external docs: it said, `I’ll inspect the installed SDK’s current API`, then searched `node_modules/mcp-use` for `Streamable|streamable|MCPServer|tool\(` and opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The earlier `npm view mcp-use readme --json` produced only package metadata (`version = '2.12.3'` and repository URL), so it did not provide the anticipated README content.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied heavily on installed-package discovery rather than a skill or fetched docs: it searched `node_modules/mcp-use/README.md` and declarations with `rg -n "streamable|http|MCPServer|createMCP|tool\\(" ...`, then inspected `server.d.ts`, including the useful precedence note: ``listen()` ... precedence is the argument, `PORT`, `config.port`, then `3000``. This worked, but required several exploratory commands before implementation.
