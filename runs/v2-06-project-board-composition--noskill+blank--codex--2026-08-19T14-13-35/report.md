# mcp-use SDK agentic eval — 2026-08-19

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-19T14-13-35` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m32s
- Median turns: 15
- Median tool calls: 21
- Median tokens in/out: 501783 / 6124
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The first documentation attempt was a dead end: fetching the npm README produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, grepping `node_modules/mcp-use` for `"streamable|resource\\(|tool\\(|MCPServer|McpServer|listen"` and reading `node_modules/mcp-use/README.md`, `dist/resources.d.ts`, `dist/tools.d.ts`, `dist/server.d.ts`, and `dist/config.d.ts`. This suggests the bundled README and declaration files were the key API-discovery resources rather than an external docs URL.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): Discovery took a detour through npm packaging after `npm view mcp-use readme --json` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then leaned on the packed SDK itself—`npm pack mcp-use@2.2.4 --silent`—and inspected `package/README.md`, `package/dist/server.d.ts`, and `package/dist/resources.d.ts`; the resource declarations provided the useful callback example, `contents: [{ uri: uri.href, mimeType: "text/plain", text: "hello" }]`. No skill file or fetched docs page appears in the transcript; the initial workspace search returned only `"."`, while the README merely exposed the documentation URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had some API-discovery friction and relied primarily on the installed package rather than a skill file: it queried npm with `npm view mcp-use version description repository.url && npm view mcp-use readme --json`, then searched `node_modules/mcp-use` for `"Streamable|streamable|resource\\(|tool\\(|MCPServer|McpServer|http"`. It used examples and declarations from `node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist/server.d.ts`, including the documented `listen(port?: number...)` API.
