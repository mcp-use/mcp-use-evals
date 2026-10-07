# mcp-use SDK agentic eval — 2026-10-07

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-07T14-07-28` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m16s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 523279 / 3837
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent notable discovery time consulting the npm metadata/readme (`npm view mcp-use readme --json`), fetching the project prompt (`curl -fsSL https://mcp-use.com/prompt.md`), and inspecting installed declarations such as `node_modules/mcp-use/dist/server.d.ts`. The fetched prompt was poorly aligned with this small local-server task because it directed the agent to `"Login to the CLI"`, `"Install the mcp-use skill"`, scaffold an MCP Apps template, and `"Deploy"`; the agent instead found the directly relevant API example in the declaration file: `server.tool(...)` followed by `await server.listen(3000);`. No skill file was actually used in the visible transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent discovery time inspecting the installed package rather than using a skill or external docs: it ran `sed -n '1,240p' node_modules/mcp-use/README.md`, then examined `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/index.d.ts` to determine the API shape. Dependency selection also took a small correction: it initially installed `zod@3` and subsequently ran `npm install zod@4`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent relied on the installed package rather than a skill or external docs, first checking npm metadata with `npm view mcp-use version description repository.url`, then grepping `node_modules/mcp-use/README.md` and declaration files for `"httpStream|streamable|MCPServer|server\\.tool\\("`. The bundled README provided the decisive API pattern, including `import { MCPServer } from "mcp-use"` and `server.tool(...)`.
