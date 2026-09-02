# mcp-use SDK agentic eval — 2026-09-02

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-02T14-07-53` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 15
- Median tool calls: 22
- Median tokens in/out: 752624 / 6680
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent relied on installed-package discovery rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`. That API-shape inspection had minor friction: the combined declaration-file command returned `"exitCode":1` while attempting several paths including `node_modules/mcp-use/dist/index-node.d.ts`, even though it still exposed useful `MCPServer.listen` documentation.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent encountered documentation discovery friction: fetching the npm README via `npm view mcp-use readme --json` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then relied heavily on installed package internals, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, and `node_modules/mcp-use/dist/server.d.ts`; the latter supplied the key transport signature, `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent relied heavily on installed-package introspection rather than a skill or external docs: it ran `sed -n '1,240p' node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `node-http.d.ts`, followed by `rg -n "listen\\(" ...` to discover API shape. The initial npm metadata/readme query yielded little beyond `"version": "2.3.4"` and `"description": "MCP framework and CLI built on the official v2 SDK"`.
