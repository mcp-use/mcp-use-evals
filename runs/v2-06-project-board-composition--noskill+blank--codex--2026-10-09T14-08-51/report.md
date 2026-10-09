# mcp-use SDK agentic eval — 2026-10-09

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-09T14-08-51` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m42s
- Median turns: 18
- Median tool calls: 25
- Median tokens in/out: 800952 / 6934
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): Discovery required inspecting the installed package because `npm view mcp-use readme --json` returned an empty result (`"output":""`). The agent then leaned heavily on local SDK declarations and README, running `sed` over `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `config.d.ts`, and `tools.d.ts`, plus `rg -n "listen\\(" ...` to establish registration and listener APIs. No skill file or fetched docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent spent substantial discovery effort inspecting package internals rather than relying on a clear server quickstart: it ran `rg -n "Streamable|streamable|resource\(|tool\(|MCPServer|create.*server|transport" node_modules/mcp-use` and opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. It also searched the official client declarations for `StreamableHTTPClientTransport`, `listTools()`, `readResource()`, and `callTool()`. The npm metadata lookup was not especially useful: `npm view mcp-use readme --json` returned only package metadata in the shown output.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: the initial npm README fetch failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent installed the package and inspected local artifacts including `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`. It then grepped the SDK declarations for `resource(`, `resourceTemplate(`, and `listen(` before implementing the server.
