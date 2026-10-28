# mcp-use SDK agentic eval — 2026-10-28

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-28T14-06-34` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the agent followed the SDK README’s instruction, `Replace its index.ts`, and the CLI reinforced that choice with `[mcp-use] built index.ts + views`, but the grading workflow required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The agent never created either expected path; its final file inventory showed only `./index.ts`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the agent’s local CLI accepted the root file and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. This made the agent’s successful local verification misleading relative to the required entry contract; the final response even linked `Server/tools: [index.ts]`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced declaration also points there via `tools: typeof import("./index.js")` in `mcp-env.d.ts`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This is especially misleading because the SDK CLI accepted that layout and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, and runtime verification said `mcp-use server running at http://localhost:3100/mcp`, so the agent concluded the project was complete without checking the expected conventional entry paths.
