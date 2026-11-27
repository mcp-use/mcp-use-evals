# mcp-use SDK agentic eval — 2026-11-27

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-27T14-04-55` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 755296 / 4872
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was finding the resource API: the agent first fetched npm metadata and the package README with `npm view mcp-use readme`, but searching that README for resources returned an empty result: `grep -n -i -C 8 'resource'` → `output":""`. It then relied on installed-package type declarations, grepping `node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts` plus `node_modules/mcp-use/dist/resources.d.ts`; this exposed the needed signature, `resource(definition: ResourceDefinition, callback: ResourceCallback...): this`. No mcp-use skill file or fetched documentation page was used; the visible external guidance was only the README’s link to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent needed substantial API discovery before implementation: it fetched the npm README, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then inspected package declarations with `rg -n "class MCPServer|resource\\(|listen\\(|streamable|http" node_modules/mcp-use/dist`. It specifically opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `node-http.d.ts`, suggesting the README alone did not provide enough resource/template and listener detail.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than using a skill or fetched documentation: it ran `rg -n "streamable|Streamable|createServer|resource\\(" node_modules/mcp-use` and opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. The README only pointed onward to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; the transcript does not show that URL being fetched.
