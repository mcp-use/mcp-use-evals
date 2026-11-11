# mcp-use SDK agentic eval — 2026-11-11

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-11T14-05-17` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m05s
- Median turns: 19
- Median tool calls: 27
- Median tokens in/out: 921409 / 7842
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery cost was determining the SDK API from the installed package rather than from a concise example. The agent first queried npm with `npm view mcp-use version description repository.url --json`, then searched internals using `rg -n "Streamable|streamable|resource\(" node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. One inspection command itself exited with `exitCode":2` while trying to read `node_modules/mcp-use/dist/index-node.d.ts`, indicating some friction around package entry points. No skill file or fetched docs URL appears; the resources actually used were npm metadata, the packaged README, declaration files, and `package.json` exports via `require('./node_modules/mcp-use/package.json').exports`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had to discover the SDK API from the installed package rather than from readily surfaced guidance: it first queried npm with `npm view mcp-use readme --json`, then inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/config.d.ts`. It also grepped declarations for `"listen|resource\\(|resources|serve|HTTP|streamable"`, indicating API-shape discovery friction around HTTP serving and resources.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent spent substantial discovery time inspecting the installed package rather than relying on a skill or fetched mcp-use documentation: it ran `find node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `config.d.ts`, and grepped for `"resource\\(|listen\\(|streamable|http"`. It also explored the bundled MCP client’s declarations to learn verification APIs, including searches for `"StreamableHTTPClientTransport|class Client"` and `"listTools\\(|callTool\\(|readResource\\("`.
