# mcp-use SDK agentic eval — 2026-09-14

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-14T14-08-35` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m07s
- Median turns: 16
- Median tool calls: 23
- Median tokens in/out: 574432 / 5584
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first fetched package metadata and the full npm README with `npm view mcp-use readme --json`, then searched installed internals using `rg -n "resource\\(|listen\\(|streamable|HTTP" node_modules/mcp-use/dist node_modules/mcp-use`, followed by direct inspection of `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, `config.d.ts`, and `tools.d.ts`. This suggests the npm package’s immediately available examples were insufficient to establish resource, template, tool, and listener signatures without several node_modules probes. The README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows no fetch of that documentation URL.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had to discover the SDK shape from package materials rather than a skill: it queried `npm view mcp-use readme`, then grepped `node_modules/mcp-use` for `"resource\\(|class MCPServer|Streamable|listen|serve"` and opened `node_modules/mcp-use/dist/server.d.ts` plus `resources.d.ts`. This worked, but indicates API discovery friction on a blank project.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had API-discovery friction and leaned on npm metadata plus installed package declarations rather than a skill file: it ran `npm view mcp-use repository.url readme --json`, followed by `rg -n "resource\(|resourceTemplate|Streamable|listen\(|http" node_modules/mcp-use/dist node_modules/mcp-use/README.md` and inspected `node_modules/mcp-use/dist/server.d.ts`. The `listen` declaration was especially useful because it documented that `listen(port?: number | undefined...)` serves HTTP and returns the bound URL.
