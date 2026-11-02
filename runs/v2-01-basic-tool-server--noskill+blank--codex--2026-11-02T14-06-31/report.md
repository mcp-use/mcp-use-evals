# mcp-use SDK agentic eval — 2026-11-02

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-02T14-06-31` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 401054 / 4232
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): Discovery took several steps: `npm view mcp-use readme` returned an empty `"output":""`, so the agent installed the package and inspected local SDK materials with `sed -n '1,260p' node_modules/mcp-use/README.md`, `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. Those declarations supplied the key API shape, including `listen(port?: number | undefined...)`, rather than a fetched docs page or skill file.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json`, then searched installed package internals using `rg -n "streamable|Streamable|createMcp|McpServer|tool\\(" node_modules/mcp-use`. It ultimately relied on `node_modules/mcp-use/README.md` for the `MCPServer`/Zod tool pattern and `node_modules/mcp-use/dist/server.d.ts` for listener behavior, especially the declaration that port precedence is “`the argument, PORT, config.port, then 3000`.” No external docs page or skill file was used in the visible transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The run had avoidable discovery friction: it began by reading `/root/.codex/skills/.system/openai-docs/SKILL.md`, even though that skill says it is for requests about “`OpenAI products or APIs`,” then queried `npm view mcp-use readme --json`, whose output contained only package metadata and no README content. The agent ultimately found the API shape by inspecting the installed package with `rg -n "streamable|Streamable|createMCPServer|MCPServer|tool\(" node_modules/mcp-use` and reading `node_modules/mcp-use/README.md` plus `dist/server.d.ts` and `dist/config.d.ts`.
