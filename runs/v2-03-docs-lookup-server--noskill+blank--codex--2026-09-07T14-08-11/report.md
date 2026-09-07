# mcp-use SDK agentic eval — 2026-09-07

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-07T14-08-11` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m33s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 564666 / 5277
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery papercut was that fetching the npm README produced an empty file: `0 /tmp/mcp-use-readme.json`, followed by `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, including `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/resources.d.ts`, and `node_modules/mcp-use/dist/tools.d.ts`; grepping the declarations surfaced the needed listener signature at `node_modules/mcp-use/dist/server.d.ts:362: listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had to discover the SDK API by inspecting the installed package rather than relying on npm metadata: `npm view mcp-use version description readme --json` returned `"readme": ""`, after which it opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/resources.d.ts`, and grepped for `"listen("`. It similarly explored the MCP client’s generated declarations with `rg -n "StreamableHTTPClientTransport|class Client"` and `rg -n "listResources|readResource|callTool"` before writing protocol checks.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery detour was the npm README fetch: `npm view mcp-use readme --json` produced an incomplete file and then failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, using `find node_modules/mcp-use`, `sed ... node_modules/mcp-use/README.md`, and then reading API declarations such as `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts`; it also grepped for key API shape with `rg -n "listen\\(|resourceTemplate|basePath..."`. No skill file or fetched docs URL appears in the transcript.
