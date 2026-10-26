# mcp-use SDK agentic eval — 2026-10-26

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-26T14-56-44` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`, while the grader searched only `src/server.ts` and `src/index.ts`; the produced file list confirms `index.ts` and no `src/` entry: `rg --files ...` returned `index.ts`, `mcp-env.d.ts`, and the two view files. This was encouraged by the package README the agent consulted, which explicitly said, `Replace its index.ts with a view-bound tool like this`, and the local CLI accepted that layout: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The agent therefore concluded success—`The server and bundled inline views build successfully`—without checking compatibility with the evaluator’s entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root: the SDK README explicitly instructed `Replace its index.ts`, and the agent created `index.ts`, while the produced configuration still had `"main": "index.js"` (`package.json`). Although the SDK accepted this—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—the grader only searched `src/server.ts` and `src/index.ts`, causing the entry failure. This is a scaffold/discovery mismatch the agent’s own build did not expose.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the agent’s own file listing confirmed only `./index.ts`. The CLI masked this mismatch by reporting `[mcp-use] built index.ts + views ...`, so the agent concluded the project was complete without testing the expected conventional entry location.
