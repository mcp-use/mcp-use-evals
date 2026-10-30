# mcp-use SDK agentic eval — 2026-10-30

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-30T14-06-41` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 15
- Median tool calls: 26
- Median tokens in/out: 788670 / 6675
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery cost was working out the SDK shape from the installed package rather than a concise external example: the agent searched declarations with `rg -n "Streamable|streamable|createMCP|McpServer|tool\\(" node_modules/mcp-use` and then read `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The initial `npm view mcp-use readme --json` produced no README content, after which the agent moved to those local files.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent relied heavily on package-local discovery rather than a skill or fetched docs: it inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and searched for `"listen|serve|Streamable|streamable|http"`. It later inspected the upstream SDK’s `client/streamableHttp.d.ts` and `client/index.d.ts` to build its verification client.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The run spent substantial time discovering API shape from the installed package rather than a skill or fetched docs: it inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and related declarations after announcing `The SDK is installed and supports a native streamable-HTTP endpoint.` Its initial npm README lookup failed because `/tmp/mcp-use-readme.json` was incomplete, producing `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`.
