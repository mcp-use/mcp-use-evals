# mcp-use SDK agentic eval — 2026-11-23

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-23T14-05-42` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 495164 / 4115
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape by inspecting the installed package rather than using a skill or external docs: it ran `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, searched for `"streamable|listen\\(|serve\\(|http"`, and inspected `node_modules/mcp-use/README.md` plus `config.d.ts` and `tools.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main discovery friction was API-shape research: the agent first queried npm with `npm view mcp-use version description repository.url && npm view mcp-use readme --json`, then searched installed package internals via `rg -n "streamable|Streamable|MCPServer|createMcpServer|tool\(" node_modules/mcp-use`, and finally inspected `node_modules/mcp-use/README.md` plus `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`. This suggests the package README and declaration files were the resources actually used to determine `MCPServer.tool` and `listen()` usage.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the API by inspecting the installed package rather than relying on prior guidance: it searched `node_modules/mcp-use/dist` and `node_modules/mcp-use/README.md` for `"streamable|Streamable|...|MCPServer"` and then read `server.d.ts`, eventually finding `listen(port?: number | undefined, options?: ListenOptions)`. The README quickstart supplied the core pattern, including `import { MCPServer } from "mcp-use";` and `inputSchema: weatherInput`.
