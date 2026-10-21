# mcp-use SDK agentic eval — 2026-10-21

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-21T14-07-54` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m32s
- Median turns: 15
- Median tool calls: 24
- Median tokens in/out: 734125 / 5644
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had discovery friction because `npm view mcp-use@2.11.0 readme --json` returned an empty `output`, so it inspected installed SDK declarations instead, including `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`; this exposed the useful `listen(port?: number...)` API and its documented precedence: “`the argument, PORT, config.port, then 3000`.” No skill file or fetched docs URL appears; the main resource was grepping `node_modules` with `rg -n "Streamable|resource|MCPServer|createMCP|tool\\("`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main wrong turn was dependency/version setup: the agent installed `zod@3`, then typechecking reported `Property 'jsonSchema' is missing`, while `npm ls` showed mcp-use’s SDK stack using `zod@4.6.7`; it recovered with `npm install zod@4`. The initial `tsconfig.json` also omitted Node types despite installing `@types/node`, producing `Cannot find name 'process'`; the agent then modified the config.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied on npm metadata and installed-package sources for SDK discovery: `npm view mcp-use version description repository.url`, followed by `rg -n "streamable|resource\\(|tool\\(|MCPServer|McpServer|http" node_modules/mcp-use` and reads of `node_modules/mcp-use/README.md` plus `dist/*.d.ts`. No external docs URL or skill-file use appears in the visible transcript; the useful API clue came from `server.d.ts`, including `listen(port?: number...)`.
