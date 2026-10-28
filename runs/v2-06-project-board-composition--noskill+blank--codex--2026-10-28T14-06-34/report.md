# mcp-use SDK agentic eval — 2026-10-28

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-28T14-06-34` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 15
- Median tool calls: 30
- Median tokens in/out: 1114357 / 8545
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had significant API-discovery overhead on a blank workspace. It first consulted npm metadata/readme via `npm view mcp-use readme`, finding the docs link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then relied heavily on installed declarations and implementation internals with `rg -n "resource\\(" node_modules/mcp-use`, `sed -n '1,460p' node_modules/mcp-use/dist/server.d.ts`, and later searches through `node_modules/@modelcontextprotocol/server`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent relied first on npm metadata/readme—`npm view mcp-use version description repository.url --json && npm view mcp-use readme`—then inspected installed declarations with `rg -n "resource\\(|Resource|Streamable|listen|serve" node_modules/mcp-use...` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`. This discovery worked, but included a dead path because it expected `node_modules/mcp-use/dist/server.js`, producing `rg: node_modules/mcp-use/dist/server.js: No such file or directory`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main SDK papercut was a Zod-version mismatch: the first typecheck rejected each schema because `Property 'jsonSchema' is missing`, and `npm ls zod` showed the app on `zod@3.25.76` while MCP dependencies used `zod@4.6.7`. The agent recovered by modifying `package.json` and rerunning `npm install && npx tsc --noEmit`, which exited successfully.
