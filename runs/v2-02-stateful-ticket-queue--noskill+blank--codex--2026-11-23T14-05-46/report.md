# mcp-use SDK agentic eval — 2026-11-23

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-23T14-05-46` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 15
- Median tool calls: 20
- Median tokens in/out: 454384 / 4920
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main friction was SDK discovery: the agent first queried npm with `npm view mcp-use version description homepage repository.url --json`, then grepped installed package files using `rg -n "streamable|Streamable|createMCP|MCPServer|McpServer|tool\(" node_modules/mcp-use`, and inspected `node_modules/mcp-use/README.md`, `dist/config.d.ts`, and `dist/tools.d.ts` before implementing. A further attempt to inspect runtime internals targeted a nonexistent file and failed with `sed: can't read node_modules/mcp-use/dist/server.js`, after which the agent searched bundled JS via `rg -n "async listen|listen\(" node_modules/mcp-use/dist -g '*.js'`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main discovery friction was the failed npm README fetch: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting installed-package resources, including `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and the bundled skill material at `node_modules/mcp-use/node_modules/@mcp-use/cli/dist/agent-skills/openapi-to-mcp/SKILL.md`; it also grepped declarations with `rg -n "streamable|Streamable|createTool|tool\\(" node_modules/mcp-use`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent spent time discovering the SDK API rather than relying on prior guidance: it queried npm with `npm view mcp-use version description homepage repository.url --json`, then searched installed files using `rg -n "Streamable|streamable|create.*Server|MCPServer|McpServer|tool\(" node_modules/mcp-use`. It ultimately leaned on `node_modules/mcp-use/README.md` and declaration files including `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`; the README quickstart provided the working `MCPServer`, `server.tool`, and Zod pattern.
