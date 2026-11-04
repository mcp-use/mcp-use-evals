# mcp-use SDK agentic eval — 2026-11-04

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-04T14-06-03` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m30s
- Median turns: 16
- Median tool calls: 19
- Median tokens in/out: 467496 / 6997
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main friction was SDK discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then relied on installed-package inspection via `rg -n "streamable|http|createServer|McpServer|tool\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and `sed -n '380,420p' node_modules/mcp-use/dist/server.d.ts`. The README quickstart supplied the `MCPServer`, `server.tool`, and Zod pattern (`import { MCPServer } from "mcp-use";`), while the declaration file established the listener API: `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had discovery friction around the SDK: `npm view mcp-use readme --json` returned an empty `"output":""`, so it inspected the installed package instead with `rg -n "Streamable|streamable|MCPServer|create.*Server|tool\\(" node_modules/mcp-use` and then read `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. This did lead it to the relevant API, including the declaration that `listen()` uses precedence of “`the argument, PORT, config.port, then 3000`.”
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): Discovery took several steps before implementation: `npm view mcp-use readme` returned `{"exitCode":0,"output":"","status":"completed"}`, so the agent fetched the GitHub README via `https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`. It then fetched the unrelated onboarding prompt at `https://mcp-use.com/prompt.md`, whose content began `I'm new to Manufact`, before turning to installed-package inspection with `rg -n "serve\\(|streamable|HTTP|transport|listen\\(" node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`. The declaration search provided the decisive listener API evidence: `listen(port?: number | undefined, options?: ListenOptions)`.
