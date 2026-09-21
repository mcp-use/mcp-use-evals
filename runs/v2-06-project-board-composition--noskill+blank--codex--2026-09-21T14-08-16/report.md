# mcp-use SDK agentic eval — 2026-09-21

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-21T14-08-16` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m06s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 767455 / 6229
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): SDK discovery consumed several probes. The npm README fetch produced no content (`0 /tmp/mcp-use-readme.json`), so the agent inspected installed declarations and README directly with `find node_modules/mcp-use`, `sed ... node_modules/mcp-use/dist/server.d.ts`, and `sed ... node_modules/mcp-use/dist/resources.d.ts`. It also relied on the installed MCP client declarations to construct verification, grepping for `"StreamableHTTP|callTool|readResource|class Client"` and reading the `StreamableHTTPClientTransport` example. No skill file or external docs URL appears in the transcript.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had initial SDK-discovery friction: it first queried npm with `npm view mcp-use readme --json`, then inspected the installed package directly via `sed -n '1,240p' node_modules/mcp-use/README.md` and declarations including `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`. No skill file or external docs URL appears in the transcript; the implementation leaned on the package README and grepping/type declarations for `resource\(`, `listen\(`, and `streamable`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK shape without a skill or existing scaffold. The agent first queried npm, but README retrieval failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then downloaded and inspected the package directly via `npm pack mcp-use@2.5.1` and extracted `package/README.md`, `package/dist/index.d.ts`, `package/dist/resources.d.ts`, and `package/dist/tools.d.ts`; the README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
