# mcp-use SDK agentic eval — 2026-10-28

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-28T14-06-31` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m39s
- Median turns: 18
- Median tool calls: 26
- Median tokens in/out: 819705 / 5513
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery friction was API shape: the agent first consulted the npm metadata/readme (`npm view mcp-use readme`) and found the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then inspected installed declarations with `rg -n "listen\\(|serve\\(|streamable|HTTP|http" node_modules/mcp-use/dist -g '*.d.ts'`. It did not visibly fetch that docs URL or use a skill file.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent had to discover the SDK shape rather than relying on a skill: it queried npm with `npm view mcp-use readme --json`, then inspected installed declarations via `sed -n '1,180p' node_modules/mcp-use/dist/server.d.ts` and grepped `node_modules/mcp-use` for `listen\(|serve\(|start\(`. The npm README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched directly.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had some SDK discovery friction and relied first on npm metadata/README—`npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`—then inspected installed declarations with `rg -n "serve|listen|streamable|MCPServer" node_modules/mcp-use` and `sed -n '1,130p' node_modules/mcp-use/dist/server.d.ts` to determine that `listen()` serves HTTP at `/mcp`.
