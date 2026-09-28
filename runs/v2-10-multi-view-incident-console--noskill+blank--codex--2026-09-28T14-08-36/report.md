# mcp-use SDK agentic eval — 2026-09-28

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-28T14-08-36` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at root as `index.ts`; the produced source is `index.ts`, while the deterministic check searched `src/server.ts` and `src/index.ts` and reported `entry: FAIL — no entry file found`. This is especially notable because the agent investigated entry conventions with `rg -n "mcp-env|index\\.ts|entry.*index|views/" node_modules/...`, but followed the CLI’s successful message, `[mcp-use] built index.ts + views ...`, rather than creating a conventional `src/` entry.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root: the produced server is `index.ts`, while the project’s generated declaration also points to `typeof import("./index.js")` in `mcp-env.d.ts`; no `src/server.ts` or `src/index.ts` was created. This explains why the external workflow could not discover the entry despite the agent’s local build reporting ``[mcp-use] built index.ts + views``.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository-root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the agent followed the installed README’s instruction, `Replace its index.ts`, and the build confirmed `built index.ts + views`. This is a scaffold/discovery mismatch: the SDK workflow accepted the root entry, but the grading/runtime convention did not.
