# mcp-use SDK agentic eval — 2026-10-19

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-19T14-08-13` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 13
- Median tool calls: 20
- Median tokens in/out: 435627 / 5263
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, but the result exposed package metadata without useful README content. It then relied heavily on installed declarations, using `rg -n "class MCPServer|resource\(|httpStream|streamable|start\(" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, `resources.d.ts`, and `tools.d.ts` before implementing. This suggests the SDK’s resource-template and HTTP-listener shapes were not immediately discoverable from package-level documentation.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had to discover the SDK API from the installed package rather than a skill or fetched docs site: it ran `rg -n "streamable|resource\\(|tool\\(|MCPServer|McpServer" node_modules/mcp-use` and inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. The README quickstart supplied the core pattern, including `import { MCPServer } from "mcp-use"` and `server.tool(`, while `server.d.ts` clarified that `listen(port?: number...)` serves HTTP.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than concise docs: it ran `sed`/`rg` across `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and later searched `node_modules/@modelcontextprotocol/client/dist/index.d.mts` for client APIs. The npm README query yielded little visible guidance—`npm view mcp-use readme --json` returned only package metadata—so API discovery required several follow-up searches such as `rg -n "listen\\(" ...` and `rg -n "readResource\\(|callTool\\(" ...`.
