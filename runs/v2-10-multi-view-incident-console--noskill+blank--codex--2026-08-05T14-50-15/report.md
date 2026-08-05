# mcp-use SDK agentic eval — 2026-08-05

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-05T14-50-15` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 3

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`, following the installed README’s instruction, `Replace its index.ts with a view-bound tool like this`, even though the grader searched only `src/server.ts, src/index.ts`; the produced tree confirms `./index.ts` and no `src/` entry. This is a significant scaffold/discovery papercut because `npx mcp-use build --inline` itself accepted that layout and reported `[mcp-use] built index.ts + views`, so the agent’s own verification could not expose the contract mismatch.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root: the produced file is `index.ts`, while the deterministic check reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This is especially easy to miss because the installed CLI advertised broader discovery: its source listed `["src/index.ts", ... ,"index.ts", ...]`, and the local build confirmed `[mcp-use] built index.ts + views ...`. The agent therefore validated the SDK workflow but not the grader-compatible project layout.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at repository root: `index.ts` contains `export default server;`, while the deterministic entry check reports `no entry file found (tried: src/server.ts, src/index.ts)`. The agent was likely guided there by the installed SDK README, which explicitly said `Replace its index.ts`, and the CLI reinforced that choice with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`; this mismatch between SDK workflow and grader entry convention consumed an otherwise functional run.
