# mcp-use SDK agentic eval — 2026-11-06

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-06T14-05-58` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root: the produced server is `index.ts`, while the grader reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was masked because the SDK CLI accepted that layout and printed `[mcp-use] built index.ts + views (incident-detail, incident-list)`, so the agent never created a conventional `src/index.ts` or tested the grader’s expected discovery path.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository root: the transcript records `fileChange({"event":"create","path":"index.ts"})`, and the produced server is `index.ts`, while the deterministic check reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This was especially easy to miss because the SDK’s own workflow accepted that layout: `built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, followed by successful runtime verification showing `"status": "verified"`.
