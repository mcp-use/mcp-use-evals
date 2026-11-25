# mcp-use SDK agentic eval — 2026-11-25

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-25T14-05-40` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry point at repository root as `index.ts`; the grader required `src/server.ts` or `src/index.ts`, while the agent treated the SDK message ``[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`` as sufficient and later reported ``Default-exported server in index.ts``. This mismatch was never checked against the expected project layout, so all downstream contract checks were blocked despite local build/start success.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at root (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader searched only `src/server.ts` and `src/index.ts`; this was masked because the SDK CLI accepted it and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The agent then concluded success with `Build and runtime checks now pass`, despite never validating the expected source-entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive integration miss was entry placement: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader searched `src/server.ts` and `src/index.ts`; the final file listing likewise showed only `index.ts` and no `src/`: `rg --files ...` → `index.ts ... views/incident-list/view.tsx`. This was easy to overlook because the SDK CLI accepted that layout and reported success: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`.
