# mcp-use SDK agentic eval — 2026-09-14

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-14T14-08-36` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the grader only searched `src/server.ts` and `src/index.ts`, while the agent relied on CLI autodiscovery because the build reported ``[mcp-use] built index.ts + views``. The CLI help exposed an escape hatch — ``--entry <path> Server entry module`` — but the agent neither moved the file under `src/` nor configured an explicit entry, despite declaring the workflow verified.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts` rather than at a grader-recognized location; the produced source is `index.ts`, while the generated declaration also points to `typeof import("./index.js")` in `mcp-env.d.ts`. This was reinforced by the local SDK workflow accepting that layout: build reported ``[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js``, so the agent had no local signal that `src/server.ts` or `src/index.ts` was required.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced source is `index.ts`, while the deterministic result says `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This mismatch was masked because the SDK CLI accepted the root entry: `"[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js"`, and the agent therefore concluded, `"The production build succeeded and the server is listening at /mcp"`.
