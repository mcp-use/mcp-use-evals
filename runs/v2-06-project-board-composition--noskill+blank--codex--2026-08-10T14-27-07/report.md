# mcp-use SDK agentic eval — 2026-08-10

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-10T14-27-07` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m16s
- Median turns: 19
- Median tool calls: 28
- Median tokens in/out: 922974 / 7166
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery: after `npm view mcp-use readme` yielded no useful README content, the agent repeatedly inspected installed-package docs and declarations, including `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/resources.d.ts`, and `node_modules/mcp-use/dist/server.d.ts`. It then similarly grepped the MCP client package for verification APIs: `rg -n "StreamableHTTPClientTransport|class Client"` and `rg -n "callTool\\(|readResource\\(|listTools\\("`. This worked, but contributed substantial exploratory work before implementation.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had substantial API-discovery friction in the blank workspace: it first queried npm metadata with `npm view mcp-use version description repository.url --json`, then inspected the installed package via `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and an `rg -n "resource\\(|listen\\(|streamable|http"` search. The declaration comment for `listen` appears to have been especially useful: `Port precedence is the argument, PORT, config.port, then 3000`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had notable SDK discovery friction, first querying npm metadata with `npm view mcp-use version description repository.url dist.tarball --json`, then inspecting package internals via `rg -n "Streamable|streamable|resource|McpServer|create.*server|http" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and reading `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. It relied on the installed README’s quickstart and docs pointers, including `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, rather than a skill file.
