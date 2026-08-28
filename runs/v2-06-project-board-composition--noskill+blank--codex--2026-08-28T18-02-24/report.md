# mcp-use SDK agentic eval — 2026-08-28

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-28T18-02-24` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 15
- Median tool calls: 19
- Median tokens in/out: 435475 / 5752
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main discovery cost was learning the SDK API from the installed package rather than a skill file or fetched docs: the agent ran `rg -n "streamable|Streamable|resource\\(|registerResource|McpServer|createMcpServer|tool\\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. The initial `npm view mcp-use readme --json` produced only package metadata in the visible output, including `"version": "2.3.3"`, so it did not visibly provide usable API guidance.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery: after `npm view mcp-use version description repository.url`, the agent inspected `node_modules/mcp-use/README.md`, then grepped declaration files with `rg -n "streamable|resource\\(|resource\\b|listen\\(|serve\\("` and opened `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts` to determine the resource, template, and HTTP APIs. The declaration-file note that “`a fresh SDK McpServer is built from it for every HTTP request`” influenced the module-scoped store; `src/server.ts` explicitly says, “`mcp-use creates fresh protocol instances per HTTP request, while the tracker state must persist.`”
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had SDK discovery friction and relied primarily on installed package internals rather than a skill or fetched docs: it inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/resources.d.ts`, and `dist/server.d.ts`, including grepping for `"listen|resource\\(|Resource|serve"`. One lookup assumed a nonexistent implementation file and failed with `rg: node_modules/mcp-use/dist/server.js: No such file or directory`, after which the agent returned to `server.d.ts` to find the `listen(port?, options?)` signature.
