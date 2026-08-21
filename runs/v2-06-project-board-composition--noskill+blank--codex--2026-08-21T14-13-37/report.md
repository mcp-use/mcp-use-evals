# mcp-use SDK agentic eval — 2026-08-21

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-21T14-13-37` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m13s
- Median turns: 21
- Median tool calls: 31
- Median tokens in/out: 1250914 / 9818
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): API discovery required both npm metadata and direct inspection of installed declarations: the agent fetched `npm view mcp-use readme` and then searched `node_modules/mcp-use/dist` for `"resource\\(|resources|Streamable|streamable|serve\\("`, followed by opening `resources.d.ts`, `server.d.ts`, and `node-http.d.ts`. No mcp-use skill file or external docs URL was visibly used; the only documentation lead shown was the README link ``https://docs.mcp-use.com/v2/typescript/getting-started/welcome``.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was SDK discovery: the agent inspected the installed README and repeatedly grepped declarations and bundles, including `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `rg -n "resourceTemplate\(" node_modules/mcp-use`, and `rg -n "class MCPServer|resourceTemplate" node_modules/mcp-use/dist -g '*.mjs'`. It also inspected the MCP client package to discover verification APIs via `find node_modules/@modelcontextprotocol/client -maxdepth 4 -type f` and the declaration example containing `const transport = new StreamableHTTPClientTransport(baseUrl);`; no skill file or fetched documentation page appears in the transcript, although the installed README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main wrong turn came from scaffold configuration: `package.json` temporarily contained both `"type": "module"` and `"type": "commonjs"`, producing `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level`; the first `tsconfig.json` also omitted Node types, producing `TS2591: Cannot find name 'process'`. The agent corrected both before the final successful typecheck.
