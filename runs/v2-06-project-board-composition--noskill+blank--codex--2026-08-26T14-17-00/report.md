# mcp-use SDK agentic eval — 2026-08-26

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-26T14-17-00` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m54s
- Median turns: 15
- Median tool calls: 24
- Median tokens in/out: 901545 / 7461
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had to discover the SDK API by searching installed package internals rather than using a skill or fetched docs: `rg -n "Streamable|streamable|resource\(|tool\(|create.*Server|MCPServer|McpServer" node_modules/mcp-use`, followed by reads of `node_modules/mcp-use/README.md` and several `dist/*.d.ts` files. It similarly explored the official client package to build lifecycle verification: `rg -n "StreamableHTTPClientTransport|protocolVersion" node_modules/@modelcontextprotocol/client/dist`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): Discovery took several steps because the npm README fetch failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then relied on installed package artifacts, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/resources.d.ts`, and grepping for `"listen\\(|resourceTemplate|resource\\("`; no skill file or fetched docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had SDK discovery friction: `npm view mcp-use readme --json` returned an empty `output`, so it inspected installed package files instead with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `node-http.d.ts`, plus `rg -n "listen|resource\\(" node_modules/mcp-use/README.md`. No skill file or external docs URL was used in the visible transcript.
