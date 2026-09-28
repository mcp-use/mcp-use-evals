# mcp-use SDK agentic eval — 2026-09-28

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-28T14-08-42` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m26s
- Median turns: 16
- Median tool calls: 30
- Median tokens in/out: 1161097 / 8132
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): API discovery took several attempts because the workspace was empty (`"The workspace is empty"`) and the npm README fetch produced an empty file: `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input` followed by `0 /tmp/mcp-use-readme.json`. The agent then leaned on the installed package’s README and declaration files, using `sed -n '1,220p' node_modules/mcp-use/README.md` and inspecting `node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts`. That exploration also hit an incorrect assumed declaration path: `sed: can't read node_modules/mcp-use/dist/index-node.d.ts: No such file or directory`, requiring a follow-up `ls` and revised paths. No skill file or fetched documentation URL appears in the transcript; the visible resources were npm metadata and `node_modules`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main discovery friction was learning the SDK API from the installed package rather than an external guide: the agent searched with `rg -n "Streamable|resource\(|tool\(|MCPServer|McpServer" node_modules/mcp-use/README.md node_modules/mcp-use/dist node_modules/mcp-use` and then inspected `node_modules/mcp-use/dist/server.d.ts`. One inspection command partially failed with `sed: can't read node_modules/mcp-use/dist/resources.d.ts` implied by `exitCode":2`, suggesting the expected declaration-file layout was not obvious.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had substantial SDK/API discovery friction and relied on installed-package inspection rather than a skill or fetched docs: it ran `npm view mcp-use version description repository.url`, read `node_modules/mcp-use/README.md`, and inspected `node_modules/mcp-use/dist/server.d.ts` plus `resources.d.ts`.
