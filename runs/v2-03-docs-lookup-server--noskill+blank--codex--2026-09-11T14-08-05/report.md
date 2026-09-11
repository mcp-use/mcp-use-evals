# mcp-use SDK agentic eval — 2026-09-11

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-11T14-08-05` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m13s
- Median turns: 19
- Median tool calls: 25
- Median tokens in/out: 919285 / 6438
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was that the npm README did not expose the needed APIs: searches for `resource(`, `resources`, `streamable`, and `listen` all returned `-1`. The agent then relied on installed type declarations, grepping `node_modules/mcp-use/dist` for `registerResource|resource\(|listen\(|class MCPServer` and reading `resources.d.ts`, `server.d.ts`, and `node-http.d.ts` before concluding that the SDK “supports both static resources and URI templates directly, with a built-in streamable HTTP listener.”
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had notable API-discovery friction: it first pulled the npm README via `npm view mcp-use readme`, then fetched the repository README, and finally inspected installed declarations with `rg -n "resource\\(|listen\\(|streamable|http" node_modules/mcp-use` plus `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. The public README output mostly presented marketing and a documentation link—`https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—so the concrete `resource`, `resourceTemplate`, and `listen` shapes came from grepping `node_modules`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): API discovery consumed several exploratory calls: the agent first queried npm metadata with `npm view mcp-use version description repository.url`, downloaded the package README via `npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts`. This suggests the package README alone did not provide enough immediately usable detail for resources, templates, and HTTP listening; the decisive API information came from `node_modules/mcp-use/dist/server.d.ts`, including `listen(port?: number | undefined, options?: ListenOptions)`.
