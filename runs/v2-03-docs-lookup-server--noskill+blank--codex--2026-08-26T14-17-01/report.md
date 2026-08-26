# mcp-use SDK agentic eval — 2026-08-26

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-26T14-17-01` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m59s
- Median turns: 15
- Median tool calls: 24
- Median tokens in/out: 694689 / 7721
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery friction was learning the SDK API from the installed package rather than an external guide: the agent ran `rg -n "streamable|resource|MCPServer|McpServer|registerResource|http" node_modules/mcp-use/README.md node_modules/mcp-use/dist` and then inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. It relied on the bundled README example showing `import { MCPServer } from "mcp-use";` and `inputSchema: weatherInput`; no skill file or fetched docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): API discovery required multiple package-inspection steps: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/README.md`, and finally opened declaration files with `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts` plus `rg -n "resourceTemplate|listen\\("`. This suggests the installed README/npm metadata alone did not immediately expose enough API shape, so the agent leaned on `node_modules` typings.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had substantial API-discovery overhead in the blank workspace: it first queried npm with `npm view mcp-use version description repository.url --json`, then packed the package twice (`npm pack mcp-use@2.3.2 --dry-run` and `npm pack mcp-use@2.3.2 --silent`) and inspected bundled declarations such as `package/dist/resources.d.ts`. The package README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows local tarball/type inspection rather than fetching that URL; no mcp-use skill file was used.
