# mcp-use SDK agentic eval — 2026-09-18

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-18T14-07-46` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 3m05s
- Median turns: 17
- Median tool calls: 32
- Median tokens in/out: 908707 / 7067
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery cost was learning the SDK API from the installed package rather than a skill or external docs: the agent searched `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/node-http.d.ts` with `rg -n "createMcpServer|streamable|resource|tool\("`, then separately searched for `listen(`. This suggests the quickstart did not immediately expose all resource-template and HTTP-listening shapes needed.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery in a blank workspace. The agent first queried npm metadata with `npm view mcp-use version description repository.url --json`, then relied heavily on installed-package docs and declarations: `rg -n "streamable|HTTP|resource\\(|tool\\(|MCPServer|McpServer" node_modules/mcp-use` followed by reads of `node_modules/mcp-use/README.md`, `dist/resources.d.ts`, `dist/tools.d.ts`, `dist/server.d.ts`, and `dist/config.d.ts`. No skill file or fetched docs URL appears; although the README surfaced `https://mcp-use.com/docs/typescript/server/tools`, the transcript does not show it being fetched.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had API-discovery friction and leaned on the installed package rather than an external guide, inspecting `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and grepping for `"listen\\(|streamable|resource\\("`. It also inspected the underlying client transport with `"rg -n \"StreamableHTTP\" node_modules/@modelcontextprotocol/client"`.
