# mcp-use SDK agentic eval — 2026-11-16

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-16T14-16-19` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m07s
- Median turns: 15
- Median tool calls: 20
- Median tokens in/out: 512413 / 5704
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs, first running `npm view mcp-use version description repository.url --json`, then grepping `node_modules/mcp-use` for `"Streamable|streamable|resource\\(|tool\\("`, and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/resources.d.ts`. It also searched the bundled MCP client for `StreamableHTTPClientTransport`, suggesting some API-discovery friction before implementing the server.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK locally: the agent first queried npm with `npm view mcp-use readme --json`, then repeatedly inspected package internals via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `node-http.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/*.js`. One search hit the bundled/minified implementation—`node_modules/mcp-use/dist/index.js:43:</html>...`—which produced noisy output rather than a concise API example.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK API from the installed package: the agent inspected `node_modules/mcp-use/dist/index.d.ts`, searched for `"streamable|resource|create.*Server|McpServer|tool"`, and then opened `node_modules/mcp-use/README.md`, `resources.d.ts`, `server.d.ts`, and `config.d.ts`. No skill file or fetched docs URL appears; the agent explicitly concluded from this inspection that `"The installed \`mcp-use\` SDK provides the streamable HTTP listener and typed resource/template APIs directly"`.
