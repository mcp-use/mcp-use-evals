# mcp-use SDK agentic eval — 2026-08-17

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-17T14-08-40` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 14
- Median tool calls: 25
- Median tokens in/out: 699298 / 5484
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had API-discovery friction and leaned first on the npm README—`npm view mcp-use readme --json`—then inspected installed declarations with `rg -n "resource\\(|resourceTemplate|...|listen\\(" node_modules/mcp-use` and `sed -n '1,430p' node_modules/mcp-use/dist/server.d.ts`. This suggests the README alone was not sufficient for confirming resource/template callback and listener shapes.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent had some API-discovery overhead because the workspace was blank: it first queried npm with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then inspected installed declarations via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and related `resources.d.ts`, `node-http.d.ts`, and `tools.d.ts`. The npm README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows no direct docs fetch; the implementation appears to have relied mainly on package typings.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had API-discovery friction and relied on package metadata plus installed declarations rather than a skill file: it first queried `npm view mcp-use version description repository.url homepage --json`, then searched `node_modules/mcp-use` with `rg -n "resource\\(|streamable|listen\\(|serve\\("`, and finally inspected `node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts` to determine resource/template and listener signatures.
