# mcp-use SDK agentic eval — 2026-08-19

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-19T14-13-32` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 17
- Median tool calls: 27
- Median tokens in/out: 782182 / 6346
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had to discover the SDK API from the installed package rather than a skill or fetched docs: it ran `rg -n "streamable|Streamable|create.*Server|McpServer|tool\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and inspected `node_modules/mcp-use/dist/server.d.ts`. That exploration hit a small dead end when a combined `sed` command returned `exitCode:2`, although the available declaration still exposed `listen(port?: number...)`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent spent substantial discovery time inspecting the installed package rather than finding a concise usage example: it first queried npm with `npm view mcp-use readme --json`, then searched `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and related declarations for `listen`, `streamable`, and tool API shapes. The declaration documentation ultimately supplied the key behavior: `Serve over HTTP on Node` and `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied heavily on package-local discovery rather than a skill or fetched docs: it ran `sed -n '1,240p' node_modules/mcp-use/README.md`, inspected `node_modules/mcp-use/dist/server.d.ts`, and searched for `listen(` and `StreamableHTTPClientTransport` across declaration files. This worked, but required several exploratory calls because the initial `npm view mcp-use readme` produced only package metadata.
