# mcp-use SDK agentic eval — 2026-11-27

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-27T14-04-58` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 20
- Median tool calls: 30
- Median tokens in/out: 1325546 / 8795
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first fetched the npm README (`npm view mcp-use readme`) and then relied heavily on installed declarations, running `rg -n "resource\\(|class MCPServer|serve\\(|listen\\(|streamable" node_modules/mcp-use...` and inspecting `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. No mcp-use skill file was used; the README exposed the docs URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had SDK discovery friction: it first queried npm metadata/readme (`npm view mcp-use readme`) and then inspected installed declarations with `rg -n "class MCPServer|resource\\(" node_modules/mcp-use/dist -g '*.d.ts'` plus `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts`. No skill file was used; the visible documentation lead was the README link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, while the implemented API shape came from grepping `node_modules`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent spent substantial discovery time inspecting installed package internals rather than using a concise server example: it read `node_modules/mcp-use/README.md`, searched declarations with `rg -n "resource|listen|http"`, and opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. It also inspected the bundled MCP client API via `node_modules/@modelcontextprotocol/client/README.md` and searches for `StreamableHTTPClientTransport`, `callTool`, and `readResource`.
