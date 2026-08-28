# mcp-use SDK agentic eval — 2026-08-28

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-28T18-02-27` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m27s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 348584 / 3476
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent substantial discovery effort before implementation, first querying npm with `npm view mcp-use version description dist-tags --json`, then inspecting the package via `npm pack mcp-use@2.3.3 --dry-run --json`, fetching the README from `https://unpkg.com/mcp-use@2.3.3/README.md`, and fetching the unrelated deployment-oriented prompt at `https://mcp-use.com/prompt.md`. That prompt emphasized scaffolding and deployment—`npx -y create-mcp-use-app@latest my-mcp-app --template mcp-apps` and `npx -y mcp-use@latest deploy`—despite the task requiring work directly in a blank directory.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had some API-discovery friction: after `npm view mcp-use readme --json` yielded no README content, it inspected the installed package with `rg -n "Streamable|streamable|MCPServer|create.*Server|tool\\(" node_modules/mcp-use` and then read `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/tools.d.ts`. Those resources supplied the working `MCPServer`, Zod `inputSchema`, `server.tool(...)`, and `server.listen(port)` shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the SDK API from the installed package rather than supplied guidance, first grepping for likely symbols with `rg -n "createMCPServer|Streamable|streamable|createTool|McpServer" node_modules/mcp-use`, then reading `node_modules/mcp-use/dist/server.d.ts`, `index.d.ts`, `README.md`, and `mount-mcp.d.ts`. This paid off because the declaration file included the needed shape, including `await server.listen(3000);`, but discovery hit a minor packaging dead end: `rg: node_modules/mcp-use/dist/server.js: No such file or directory (os error 2)`.
