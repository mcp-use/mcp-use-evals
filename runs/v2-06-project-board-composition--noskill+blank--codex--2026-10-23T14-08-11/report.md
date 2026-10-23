# mcp-use SDK agentic eval — 2026-10-23

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-23T14-08-11` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m47s
- Median turns: 17
- Median tool calls: 31
- Median tokens in/out: 968775 / 7715
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): Discovery was relatively expensive: the agent first queried npm metadata (`npm view mcp-use version description repository.url --json`), then attempted to parse the npm README and hit `Unexpected end of JSON input`. It ultimately leaned on the installed package rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, and grepping for `"streamable|Streamable|resource\\(|tool\\("`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main friction was API discovery. The agent first queried npm metadata with `npm view mcp-use readme --json`, then inspected the installed package via `find node_modules/mcp-use`, `node_modules/mcp-use/README.md`, and declaration files including `dist/server.d.ts`, `dist/tools.d.ts`, and `dist/resources.d.ts`. This suggests the package README alone was not enough to establish the resource and transport APIs, requiring direct declaration-file inspection.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main cost was SDK API discovery before implementation. The agent queried npm metadata (`npm view mcp-use version description repository.url dist-tags --json`), packed the package (`npm pack mcp-use@2.11.2 --silent`), listed archive contents (`tar -tzf mcp-use-2.11.2.tgz`), and repeatedly inspected bundled declarations such as `package/dist/server.d.ts`, `package/dist/resources.d.ts`, and `package/dist/tools.d.ts`. The README exposed the documentation URL, `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows declaration-file inspection rather than fetching that URL; no mcp-use skill file appears in the transcript.
