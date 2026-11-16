# mcp-use SDK agentic eval — 2026-11-16

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-16T14-16-09` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m47s
- Median turns: 12
- Median tool calls: 18
- Median tokens in/out: 490776 / 5557
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery in a blank project: the agent first queried npm metadata with `npm view mcp-use version description repository.url peerDependencies dependencies --json`, then searched the installed package using `rg -n "streamable|resource\\(|\\.tool\\(|createMcpServer|McpServer" node_modules/mcp-use/{README.md,dist,src}`. That search included a nonexistent path and emitted `rg: node_modules/mcp-use/src: No such file or directory`, while also surfacing a large minified `dist/index.js` result, adding noise.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main wrong turn was fighting the generated package metadata: `package.json` contained both `"type": "module"` and a later `"type": "commonjs"`, which led to `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level`; the same typecheck also reported `Cannot find name 'process'` despite `@types/node` being installed, requiring a `types` configuration fix. A subsequent successful typecheck was obscured by an unrelated repository assumption: `git diff --check` failed with `warning: Not a git repository`, producing exit code 129.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: the agent explicitly said it was “`inspecting its installed server API`” and searched `node_modules/mcp-use` for “`Streamable|resource\(|...|MCPServer`,” then read `README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. It relied on the package’s bundled README quickstart—“`import { MCPServer } from "mcp-use";`”—and declaration files rather than a skill file or fetched docs URL.
