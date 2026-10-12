# mcp-use SDK agentic eval — 2026-10-12

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-12T14-14-07` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m54s
- Median turns: 15
- Median tool calls: 28
- Median tokens in/out: 768487 / 5582
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than external docs: it searched `node_modules/mcp-use/README.md` and declarations with `rg -n "Streamable|streamable|createMCPServer|MCPServer|tool\\("`, then read `node_modules/mcp-use/dist/server.d.ts` and `tools.d.ts`. The README quickstart supplied the successful core shape, including `import { MCPServer } from "mcp-use";`, `server.tool(`, and `export default server;`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent hit package-discovery friction immediately: reading `require('mcp-use/package.json')` failed with `ERR_PACKAGE_PATH_NOT_EXPORTED`. It recovered by inspecting the installed package directly—`sed -n '1,220p' node_modules/mcp-use/package.json`—then leaned on the bundled quickstart in `node_modules/mcp-use/README.md` and grepped declarations including `node_modules/mcp-use/dist/server.d.ts`, where it found `listen(port?: number...)`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had API-discovery friction and leaned heavily on the installed package rather than a skill file: it first queried `npm view mcp-use version description...`, then searched `node_modules/mcp-use` with `rg -n "streamable|Streamable|createMcpServer|McpServer|tool\("`, and finally inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/config.d.ts`. The README exposed a docs link—`https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—but the transcript does not show it being fetched.
