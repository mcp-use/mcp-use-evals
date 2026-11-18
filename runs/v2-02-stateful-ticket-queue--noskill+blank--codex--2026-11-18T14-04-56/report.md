# mcp-use SDK agentic eval — 2026-11-18

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-18T14-04-56` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m27s
- Median turns: 19
- Median tool calls: 26
- Median tokens in/out: 687637 / 8641
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had substantial API-discovery friction because `npm view` returned an empty README (`"readme": ""`), so it inspected the installed package directly with `find node_modules/mcp-use`, `rg -n "streamable|Streamable..."`, and excerpts from `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`. The useful SDK clues were the README’s `import { MCPServer } from "mcp-use"` example and the declaration `listen(port?: number ...): Promise<{ port: number; url: string; }>`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The blank project required API discovery from the installed package: the agent first ran `npm view mcp-use version description readme --json`, but the registry returned `"readme": ""`, then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts` to determine the `MCPServer`, `tool`, and `listen` shapes. No skill file or external docs URL was used; the visible discovery was package metadata and grepping declarations via `rg -n "streamable|create.*server|MCPServer|tool\\(" node_modules/mcp-use`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was API discovery: after `npm view mcp-use readme --json` returned no useful README content, the agent inspected the installed package directly with `sed -n '1,200p' node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/node-http.d.ts`, then concluded that “`MCPServer.listen()` provides the streamable HTTP transport.” No mcp-use skill file or fetched docs URL appears in the transcript; the run relied on npm metadata and grepping/reading `node_modules`.
