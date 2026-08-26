# mcp-use SDK agentic eval — 2026-08-26

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-26T14-17-02` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m22s
- Median turns: 22
- Median tool calls: 28
- Median tokens in/out: 873777 / 6956
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied on the installed package rather than a skill or external docs, first reading `node_modules/mcp-use/README.md` and then grepping declarations with `rg -n "listen|streamable|node-http|MCPServer" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. It inspected `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts` before concluding it could use “`the SDK’s native /mcp streamable-HTTP listener`,” indicating some API-discovery friction in the blank workspace.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had SDK-discovery friction and leaned heavily on the installed package internals, running `rg -n "streamable|Streamable|create.*server|MCPServer|McpServer|tool\\(" node_modules/mcp-use` and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/index.d.ts`; no external docs fetch or skill-file use appears in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main wrong turn was project configuration: after editing `package.json`, it contained both `"type": "module"` and `"type": "commonjs"`, producing `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` Node typings were installed but omitted from compiler configuration, causing `TS2591: Cannot find name 'process'`; the agent then corrected `package.json` and `tsconfig.json` before `npx tsc --noEmit` passed.
