# mcp-use SDK agentic eval — 2026-09-11

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-11T14-08-06` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 286869 / 3483
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url --json`, then inspected installed declarations and README via `rg -n "httpStream|streamable|transportType|class MCPServer|listen\(" node_modules/mcp-use` and `sed ... node_modules/mcp-use/dist/server.d.ts ... node_modules/mcp-use/README.md`. It also checked schema typing in `node_modules/mcp-use/dist/tools.d.ts`, where it found `inputSchema?: StandardSchemaWithJSON;`; this indicates node_modules type definitions were the primary resource rather than a skill file or fetched docs URL.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had some API-discovery friction in the blank workspace: it first queried npm with `npm view mcp-use version description repository.url && npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "class MCPServer|listen\\(|serve\\(" node_modules/mcp-use` and `sed -n '1,115p' node_modules/mcp-use/dist/server.d.ts`. The package README primarily pointed onward to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, while the decisive API example appeared in `node_modules/mcp-use/dist/server.d.ts` as `const server = new MCPServer(...)` and `server.tool(...)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The run was successful but incurred API-discovery overhead in the blank workspace. The agent first queried npm metadata with `npm view mcp-use version description repository.url`, then inspected the installed package via `sed -n '1,240p' node_modules/mcp-use/README.md`, and finally grepped declarations with `rg -n "listen\\(|serve\\(|streamable|HTTP|transport" ... node_modules/mcp-use/dist/*.d.ts`. The decisive API guidance appears to have come from `node_modules/mcp-use/dist/server.d.ts`, whose quoted docs say `Serve over HTTP on Node` and describe `listen(port?: number | undefined, options?: ListenOptions)`; no skill file or fetched docs URL appears in the transcript.
