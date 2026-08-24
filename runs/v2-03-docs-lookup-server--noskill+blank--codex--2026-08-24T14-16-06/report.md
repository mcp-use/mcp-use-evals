# mcp-use SDK agentic eval — 2026-08-24

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-24T14-16-06` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m59s
- Median turns: 13
- Median tool calls: 22
- Median tokens in/out: 516266 / 6284
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had discovery friction in the blank directory, first consulting npm metadata and the package README via `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then grepping installed declarations with `rg -n "resource\\(|Resource|resources" node_modules/mcp-use/dist`. It relied especially on `node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts` to determine resource callback and `listen()` shapes; the declaration clarified that `listen(port?: number...)` returns an object containing `port` and `url`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent needed API discovery before implementation, first querying npm (`npm view mcp-use readme`) and then grepping installed declarations for `"resource\\(|resourceTemplate|Streamable|listen\\("`, followed by reading `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. No skill file was found in the initial `find .. -name AGENTS.md -print` output, which was empty.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on package discovery and installed declarations rather than a skill file: it fetched the npm README with `npm view mcp-use readme`, then searched SDK internals using `rg -n "resource\\(|resources|Streamable|serve\\(" node_modules/mcp-use/dist`. The declarations provided useful API shape, including `resource(definition: ResourceDefinition, callback: ResourceCallback...)` and `listen(port?: number | undefined, options?: ListenOptions)`.
