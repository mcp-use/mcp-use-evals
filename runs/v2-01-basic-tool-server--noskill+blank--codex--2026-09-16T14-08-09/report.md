# mcp-use SDK agentic eval — 2026-09-16

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-16T14-08-09` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m13s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 347289 / 3585
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): API discovery required several fallbacks: the agent queried npm (`npm view mcp-use version description repository.url homepage --json`), fetched the GitHub README, then consulted `https://mcp-use.com/prompt.md`, which redirected attention to “`Read the v2 docs first: https://docs.mcp-use.com/v2/typescript/getting-started/welcome`” and instructions to “`Install the mcp-use skill`.” It did not use that skill; instead, it attempted `https://docs.mcp-use.com/v2/typescript/server/transport`, which returned an HTML error shell containing “`<html id="__next_error__">`” and “`<meta name="robots" content="noindex"/>`.”
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main time cost was API discovery in the installed package: the agent first queried npm with `npm view mcp-use version description repository.url peerDependencies dependencies --json && npm view mcp-use readme --json`, then searched package internals using `rg -n "Streamable|streamable|createMCPServer|MCPServer|tool\\(" node_modules/mcp-use`, and finally inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The bundled README’s quickstart was directly useful, showing `import { MCPServer } from "mcp-use"`, `inputSchema: weatherInput`, and `export default server;`; the declaration search supplied the less-visible `listen` and port API through `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): Discovery took extra steps because the npm README lookup produced no content: `npm view mcp-use readme --json > /tmp/mcp-use-readme.json`, followed by `0 /tmp/mcp-use-readme.json`. The agent then relied on installed package declarations, first grepping `node_modules/mcp-use/dist` for `"streamable|Streamable|http|MCPServer|create"` and then reading `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts`. Those declarations contained a directly useful example—`const server = new MCPServer(...)` and `inputSchema: z.object(...)`—so the API became straightforward once dependencies were installed.
