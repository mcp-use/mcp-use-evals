# mcp-use SDK agentic eval — 2026-10-14

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-14T14-07-36` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 646717 / 6256
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs: it read `node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/index.d.ts`, `server.d.ts`, `resources.d.ts`, and `tools.d.ts`. It also spent time probing the bundled MCP client API with `find node_modules/@modelcontextprotocol/client` and `rg -n "class.*Client|StreamableHTTP|Client"`, but ultimately abandoned that route and verified via raw `curl` JSON-RPC requests.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery work came from inspecting the installed package rather than external docs: the agent ran `rg -n "streamable|HTTP|createServer|resource|MCPServer|McpServer" node_modules/mcp-use` and then opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. The initial registry-readme probe was unhelpful—the `npm view mcp-use readme --json` output contained only package metadata—so local package inspection supplied the API shape.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent relied heavily on package-local discovery rather than external docs or a skill file, first reading `node_modules/mcp-use/README.md` and then grepping declarations with `rg -n "resource\\(|listen\\(|Streamable|streamable|createServer|serve" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. One exploratory command assumed declaration files that were not present—`sed ... node_modules/mcp-use/dist/node-http.d.ts ... index-node.d.ts`—and exited with `"exitCode":2`, adding minor SDK-shape discovery friction.
