# mcp-use SDK agentic eval — 2026-09-07

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-07T14-08-11` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m26s
- Median turns: 15
- Median tool calls: 19
- Median tokens in/out: 388878 / 3893
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had some SDK discovery friction: `npm view mcp-use readme --json` returned no README content, so it inspected the installed package with `rg -n "streamable|http|MCPServer|createMCPServer|tool\(" node_modules/mcp-use` and read `node_modules/mcp-use/README.md` plus `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The package README’s quickstart supplied the eventual API shape, including `import { MCPServer } from "mcp-use"` and `server.tool(...)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): Discovery took several steps because the initial npm README fetch failed: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then inspected the published package directly with `npm pack mcp-use@2.4.3` and extracted `README.md`, `dist/server.d.ts`, and `dist/index.d.ts`; the declaration example supplied the needed shape, including `inputSchema: z.object(...)` and `await server.listen(3000);`. No mcp-use skill file or fetched docs URL was used, although the packaged README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: `npm view mcp-use readme --json` returned an empty `"output":""`, so the agent next used `npm pack mcp-use --dry-run` and then inspected installed package files with `sed -n '1,260p' node_modules/mcp-use/README.md`, `dist/index.d.ts`, and `dist/server.d.ts`. It also grepped the declarations for listener shape via `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`, eventually finding the useful contract `listen(port?: number | undefined, options?: ListenOptions)` and documentation that the port precedence is “the argument, `PORT`, `config.port`, then `3000`.” No mcp-use skill file or fetched docs URL appears; the package README merely exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, while the actual implementation leaned on `node_modules` declarations.
