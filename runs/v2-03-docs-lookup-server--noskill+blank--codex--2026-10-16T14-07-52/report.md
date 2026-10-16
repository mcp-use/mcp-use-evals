# mcp-use SDK agentic eval — 2026-10-16

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-16T14-07-52` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 17
- Median tool calls: 28
- Median tokens in/out: 1014149 / 6917
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had discovery friction around the SDK API: `npm view mcp-use readme --json` returned no README content, so it inspected installed package internals with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts` to determine the registration and listen shapes.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than a skill file or fetched docs: it searched `node_modules/mcp-use` with `rg -n "streamable|resource\\(|tool\\(|MCPServer|McpServer|http"` and opened `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. This discovery path worked, but added several exploratory calls.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery friction was unavailable npm README content: `npm view mcp-use readme --json` led to `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, and plain `npm view mcp-use readme` returned an empty output. The agent instead inspected installed SDK artifacts directly, including `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`; the declarations clarified that `MCPServer` is exported via `export { MCPServer } from "./server.js";`. No skill file or external docs URL appears in the transcript.
