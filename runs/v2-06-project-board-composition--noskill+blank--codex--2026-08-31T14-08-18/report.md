# mcp-use SDK agentic eval — 2026-08-31

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-31T14-08-18` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m20s
- Median turns: 15
- Median tool calls: 28
- Median tokens in/out: 1023045 / 6693
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery: the agent queried package metadata with `npm view mcp-use version description peerDependencies dependencies --json`, then searched installed declarations using `rg -n "Streamable|streamable|resource\\(|registerResource|registerTool|MCPServer|McpServer" node_modules/mcp-use`. It also inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and related declaration files rather than using a fetched docs page or skill file.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main SDK papercut was schema-version compatibility: the agent initially installed `zod@3.25.76`, then typechecking failed because `Property 'jsonSchema' is missing`, prompting the correction, “`The SDK’s current typed-schema interface expects Zod 4`,” followed by `npm install zod@4.5.4`. This cost an install/typecheck cycle and suggests the required Zod generation was not obvious from package metadata.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had some SDK discovery friction before implementation: it fetched the npm README via `npm view mcp-use readme` and then inspected installed declarations with `rg -n "resource\(|streamable|serve\(|listen\(" node_modules/mcp-use/dist` plus `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. No mcp-use skill file was used; the visible resources were the npm README, which linked to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, and package type declarations.
