# mcp-use SDK agentic eval — 2026-11-09

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-09T14-05-25` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m12s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 446943 / 4150
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery friction was determining the SDK’s server and tool APIs from the installed package. The agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then installed dependencies and searched the package using `rg -n "streamable|Streamable|serve|tool\(" node_modules/mcp-use`. It ultimately leaned on `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/tools.d.ts`, and `node_modules/mcp-use/dist/index.d.ts`; the README example supplied the working `MCPServer`, `server.tool`, Zod schema, and default-export pattern.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main time sink was API discovery before implementation. The npm metadata offered no package guidance because it returned `"readme": ""`, so the agent fetched the GitHub README and then `https://mcp-use.com/prompt.md`; that URL was a distraction, beginning `"I'm new to Manufact. Help me connect it to this AI client"` rather than documenting server construction. It next inspected the published tarball with `rg -n "streamable|listen..."`, then queried the GitHub tree and fetched `libraries/typescript/packages/server/examples/basic/src/index.ts` plus `libraries/typescript/packages/server/src/server.ts`. The decisive API evidence came from source comments showing `await server.listen(3000);` and the example’s typed registration, `inputSchema: z.object({ a: z.number(), b: z.number() })`. No mcp-use skill file appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the API locally rather than relying on prior guidance: it searched `node_modules/mcp-use` with `rg -n "streamable|HTTP|createMcpServer|MCPServer|tool\\("` and then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/config.d.ts`. The packaged README’s quickstart supplied the core pattern, including `import { MCPServer } from "mcp-use";`, `server.tool(`, Zod schemas, and structured tool results.
