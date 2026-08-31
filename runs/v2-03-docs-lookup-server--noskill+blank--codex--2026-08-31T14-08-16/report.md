# mcp-use SDK agentic eval — 2026-08-31

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-31T14-08-16` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 14.5
- Median tool calls: 21.5
- Median tokens in/out: 545860.5 / 5169
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had initial SDK-discovery friction and inspected the installed package rather than relying on a skill or external docs: `find node_modules/mcp-use ...`, `sed -n '1,240p' node_modules/mcp-use/README.md`, and searches for `"createMCP|createServer|resource\\(|tool\\(|streamable|http"`. It then dug into declaration files such as `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts` to establish that `MCPServer.listen()` and `resourceTemplate()` were the relevant APIs. One declaration-inspection command failed with exit code 2 while attempting to read `node_modules/mcp-use/dist/index-node.d.ts`, despite the earlier file listing showing `node_modules/mcp-use/dist/index-node.js` but no corresponding `.d.ts`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main SDK-discovery cost was learning the API from package metadata and installed declarations rather than an mcp-use skill: the agent fetched `npm view mcp-use readme --json` and then searched `node_modules/mcp-use/dist` for `"resource\\(|class MCPServer|listen\\(|streamable|http"`. It needed several declaration-file inspections before implementation, including `sed -n '1,220p' node_modules/mcp-use/dist/resources.d.ts` and `sed -n '1,180p' node_modules/mcp-use/dist/tools.d.ts`; the useful declaration documentation did clearly provide an example callback returning `contents: [{ uri: uri.href, mimeType: "text/plain", text: "hello" }]`.
