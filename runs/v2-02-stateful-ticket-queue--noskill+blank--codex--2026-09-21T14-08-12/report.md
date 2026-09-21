# mcp-use SDK agentic eval — 2026-09-21

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-21T14-08-12` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 15
- Median tool calls: 19
- Median tokens in/out: 509342 / 5401
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied on package-local discovery rather than a skill or fetched docs: it queried `npm view mcp-use version description repository.url --json`, then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/index.d.ts`, and `dist/tools.d.ts` to determine the `MCPServer`, `tool`, and `listen` APIs. This worked, but required several exploratory calls, including `rg -n "listen\\(|serve|streamable|mount"` across declarations and the README.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main wrong turn was a package scaffold/config conflict: `package.json` contained both `"type": "module"` and `"type": "commonjs"`, so although `npx tsc --noEmit` passed, startup failed with `Top-level await is currently not supported with the "cjs" output format`. The agent inspected `cat package.json`, corrected it, and the next run reached `Support ticket MCP server listening at http://localhost:3100/mcp`. This is a notable papercut from modifying the `npm init` scaffold rather than cleanly replacing its module setting.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was SDK/API discovery: the agent queried npm with `npm view mcp-use version description repository.url` and then inspected installed package internals using `rg -n -i "streamable|listen\\(|http" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts` plus `sed -n '320,390p' node_modules/mcp-use/dist/server.d.ts`. This worked, but indicates the implementation path depended on grepping declarations rather than an immediately usable top-level example; the useful declaration was `Serve over HTTP on Node` with port precedence documented as `the argument, PORT, config.port, then 3000`.
