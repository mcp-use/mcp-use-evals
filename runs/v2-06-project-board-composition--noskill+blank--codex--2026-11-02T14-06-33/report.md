# mcp-use SDK agentic eval — 2026-11-02

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-02T14-06-33` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 17
- Median tool calls: 24
- Median tokens in/out: 654310 / 7230
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery friction was API-shape investigation: the agent first tried npm metadata/readme, but `npm view mcp-use readme` produced an empty file and `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then leaned heavily on installed declarations and package sources, including `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts` and searches for `"listen\\(|resourceTemplate|new MCPServer"`, rather than a skill file or fetched docs URL.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery friction was documentation/API shape. The first attempt to fetch the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, after which the agent inspected package contents via `npm pack mcp-use@2.12.2 --dry-run`. It then leaned heavily on installed package documentation and declarations, explicitly saying, `I’m checking the installed SDK’s current server APIs`, and searching `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/resources.d.ts` for `listen(`, `resource(`, and `resourceTemplate`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): API discovery took several exploratory steps: `npm view mcp-use readme --json` produced no README content, so the agent searched installed declarations with `rg -n "streamable|Streamable|registerTool|resource" node_modules/mcp-use/...` and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. No skill file or external docs URL was used; the main resource was the package’s type declarations.
