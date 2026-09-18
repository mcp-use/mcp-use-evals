# mcp-use SDK agentic eval — 2026-09-18

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-18T14-07-46` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/2 |

## pass^k

pass^2: 0% (0/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 2

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) rather than either grader-recognized entry path; the produced tree confirms `./index.ts` and no `src/server.ts` or `src/index.ts` (`find ...` output: `./index.ts`). The CLI masked this mismatch because its build auto-discovered the root file and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent concluded the workflow was valid without checking the expected source-layout convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was following the SDK scaffold’s root-entry convention rather than the evaluator’s expected `src/` convention. The scaffold explicitly reported `index.ts (server entry point)`, and the agent created only root `index.ts` (`index.ts`: `export default server;`); no `src/server.ts` or `src/index.ts` was produced. This explains why the agent’s own command succeeded—`[mcp-use] built index.ts + views`—while the deterministic result reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`.
