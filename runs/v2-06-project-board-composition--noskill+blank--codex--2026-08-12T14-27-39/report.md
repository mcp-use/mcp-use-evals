# mcp-use SDK agentic eval — 2026-08-12

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-12T14-27-39` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m02s
- Median turns: 14
- Median tool calls: 27
- Median tokens in/out: 640508 / 6550
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery friction was determining the SDK shape manually. The agent queried npm with `npm view mcp-use version description repository.url`, inspected package contents using `npm pack mcp-use --dry-run`, and then read installed documentation/type declarations via `sed -n '1,260p' node_modules/mcp-use/README.md` and searches such as `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. The README exposed the documentation URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows inspection of local package files rather than fetching that URL.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery friction was documentation/API shape. The npm README attempt failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent inspected installed declarations instead, including `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`; it then similarly grepped the MCP client package for `StreamableHTTPClientTransport`, `callTool(`, and `readResource(` to construct lifecycle verification.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main papercut was documentation discovery: `npm view mcp-use readme` returned `"output":""`, so the agent relied on the installed package instead, reading `node_modules/mcp-use/README.md` and declaration files including `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. It also grepped package internals for the startup API with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/index-node.js node_modules/mcp-use/dist/chunk-*.js`, which unnecessarily pulled in a large minified `index-node.js` result before confirming the typed signature `listen(port?: number | undefined, options?: ListenOptions)`.
