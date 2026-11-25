# mcp-use SDK agentic eval — 2026-11-25

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-25T14-05-31` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m32s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 744852 / 5124
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main wrong turn was scaffold configuration: the first typecheck failed with `Cannot find name 'process'` and `The current file is a CommonJS module and cannot use 'await' at the top level.` Inspection then revealed duplicate, conflicting package fields—`"type": "module"` and later `"type": "commonjs"`—despite `@types/node` being installed. The agent corrected `package.json` and `tsconfig.json`, after which `npx tsc --noEmit` exited cleanly.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first fetched the package README with `npm view mcp-use@2.12.10 readme --json`, then searched installed internals using `rg -n "resource\(|class MCPServer|listen\(|Streamable|streamable|http" node_modules/mcp-use...`, and finally inspected declarations with `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts` plus `resources.d.ts` and `tools.d.ts`. This suggests the package README alone did not provide enough immediately usable detail for resources, templates, and HTTP startup.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery cost was API-shape research: the agent fetched npm metadata and the package README with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts`. No skill file or fetched docs URL appears; the README only surfaced the link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
