# mcp-use SDK agentic eval — 2026-08-17

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-17T14-08-40` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m09s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 519935 / 3799
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied first on npm package metadata and README via `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then inspected installed declarations with `rg -n "class MCPServer|listen\(|serve\(|Streamable" node_modules/mcp-use/dist` and `sed -n '1,125p' node_modules/mcp-use/dist/server.d.ts` to confirm the API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent time discovering the API rather than using a skill: it queried the npm README (`npm view mcp-use readme`) and fetched `https://mcp-use.com/prompt.md`, but that prompt was oriented toward scaffolding and deployment—`“Login to the CLI”`, `“Install the mcp-use skill”`, and `“Deploy”`—rather than this small blank-directory server. It then grepped installed package internals for `“class MCPServer|MCPServer|listen\\(|serve\\(”` and inspected `node_modules/mcp-use/dist/server.d.ts` to determine the actual API shape. That inspection command itself was brittle and exited 2 while requesting several declaration files, including `node_modules/mcp-use/dist/index-node.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main discovery friction was API-shape uncertainty: after querying npm metadata and the package README with `npm view mcp-use readme --json`, the agent still searched installed declarations and runtime files using `rg -n "listen\\(|serve\\(|streamable|MCPServer" node_modules/mcp-use` and then opened `node_modules/mcp-use/dist/server.d.ts`, `node-http.d.ts`, and `index.d.ts`. The declaration’s embedded example appears to have supplied the exact registration pattern: `server.tool(... { name: "add", inputSchema: z.object(...) } ...)`. No mcp-use skill file or fetched docs URL appears in the transcript; the visible resources were npm metadata/README and grepping `node_modules`.
