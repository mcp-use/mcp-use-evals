# mcp-use SDK agentic eval — 2026-09-25

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-25T14-08-27` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m35s
- Median turns: 18
- Median tool calls: 26
- Median tokens in/out: 952527 / 8038
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs, first running `rg -n "streamable|resource\\(|tool\\(|MCPServer|McpServer|http" node_modules/mcp-use` and then reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts`. This was productive API discovery, but the initial `npm view mcp-use readme --json` yielded only package metadata in the shown output, so it did not provide usable guidance.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main time sink was SDK/API discovery: the npm README query returned no content (`npm view mcp-use readme` → `output":""`), so the agent fetched the GitHub README and `https://mcp-use.com/prompt.md`, then inspected installed declarations with `rg -n "resource\\(|resourceTemplate|Streamable|listen\\(|port" node_modules/mcp-use...` and `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`. The fetched prompt was poorly aligned with this task, directing agents to `Login to the CLI`, `Install the mcp-use skill`, scaffold an MCP Apps template, and deploy; the agent appropriately did not follow those steps, and no skill file was used.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK from the package itself: the agent ran `npm view mcp-use readme --json`, then `npm pack mcp-use --silent`, extracted `package/README.md`, and inspected `package/dist/index.d.ts`, `package/dist/server.d.ts`, `package/dist/resources.d.ts`, `package/dist/config.d.ts`, and `package/dist/tools.d.ts`. This suggests the API shape was not immediately available from the initial package metadata; `npm view` returned only `version = '2.7.0'`, a description, and repository URL.
