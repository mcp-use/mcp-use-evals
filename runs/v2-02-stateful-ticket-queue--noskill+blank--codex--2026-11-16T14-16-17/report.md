# mcp-use SDK agentic eval — 2026-11-16

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-16T14-16-17` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m00s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 414057 / 5738
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had some SDK discovery friction: `npm view mcp-use readme --json` returned no README content, so it inspected the installed package with `rg -n "Streamable|HTTP|streamable|create.*Server|McpServer|tool\\(" node_modules/mcp-use` and then read `node_modules/mcp-use/README.md` plus `node_modules/mcp-use/dist/server.d.ts`. The installed README quickstart supplied the key API shape, including `import { MCPServer } from "mcp-use"`, `server.tool(`, and `export default server;`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): Initial SDK discovery had friction: fetching the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, using `sed -n '1,200p' node_modules/mcp-use/README.md` and grepping declarations with `rg -n "streamable|http|listen|MCPServer|node-http" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. No skill file or external docs URL was used; the transcript instead shows reliance on `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `tools.d.ts`, and `node-bridge.d.ts`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main discovery friction was documentation access: fetching the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, using `sed -n '1,240p' node_modules/mcp-use/README.md` and then declaration files including `node_modules/mcp-use/dist/server.d.ts`, where it found the native `listen(port?: number...)` API and its port precedence.
