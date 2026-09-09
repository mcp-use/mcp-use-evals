# mcp-use SDK agentic eval — 2026-09-09

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-09T14-07-38` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m23s
- Median turns: 17
- Median tool calls: 23
- Median tokens in/out: 802406 / 6768
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent spent notable time discovering API shape directly from the installed package, first reading `node_modules/mcp-use/README.md`, then probing declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/config.d.ts`. One declaration-inspection command itself failed with `exitCode":2`, so SDK discovery was somewhat manual and brittle. It also inspected the transitive MCP client package to build verification code: `sed -n '1,260p' node_modules/@modelcontextprotocol/client/README.md` and `rg -n "readResource\\(|callTool\\(" node_modules/@modelcontextprotocol/client/dist/index.d.mts`. No mcp-use skill file or fetched external docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main cost was SDK/API discovery through package internals rather than a concise working example: the agent ran `rg -n "streamable|createServer|MCPServer|resource|tool\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. One lookup took a wrong path because `node_modules/mcp-use/dist/server.js` did not exist, producing `No such file or directory (os error 2)`. An earlier attempt to retrieve npm’s README also failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than using a skill or fetched docs URL: it ran `npm view mcp-use readme --json`, then searched `node_modules/mcp-use/README.md` and declarations with `rg -n "streamable|Streamable|create.*server|McpServer|tool\\("`. It further inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `config.d.ts` to find APIs such as `listen(port?: number...)`, indicating some discovery friction around transport, resources, and startup.
