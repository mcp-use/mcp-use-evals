# mcp-use SDK agentic eval — 2026-09-04

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-04T14-07-23` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 14
- Median tool calls: 19
- Median tokens in/out: 454846 / 4482
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied on npm metadata and package-local documentation/type declarations rather than a skill file: it ran `npm view mcp-use version description repository.url peerDependencies dependencies --json`, searched `node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist`, then inspected `server.d.ts` for `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): Discovery took a detour when fetching npm metadata/readme: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, first grepping `node_modules/mcp-use` for `"streamable|Streamable|tool\\("`, then reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/config.d.ts`. Those declarations supplied the key behavior, including `listen(port?: number...)` and the config note that the TCP port uses `PORT`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): Discovery required package inspection rather than a straightforward npm README: `npm view mcp-use readme` returned `""`, after which the agent searched `node_modules/mcp-use` with `rg -n "Streamable|streamable|HTTP|McpServer|tool\("` and consulted `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The installed README quickstart did provide the core shape, including `import { MCPServer } from "mcp-use"` and `server.tool(`.
