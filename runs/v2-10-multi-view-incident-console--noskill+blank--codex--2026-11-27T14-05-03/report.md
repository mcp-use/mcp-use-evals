# mcp-use SDK agentic eval — 2026-11-27

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-27T14-05-03` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`, shown by ``[tool] fileChange({"event":"create","path":"index.ts"})`` and `index.ts: export default server;`, rather than under `src/`. This choice was reinforced by inspecting the SDK CLI’s discovery list, which explicitly included root entries: ``["src/index.ts",...,"index.ts",...,"server.ts"]``. The SDK build therefore appeared healthy—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but the trial’s entry convention was not satisfied.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`, while the deterministic grader searched `src/server.ts` and `src/index.ts`; the produced declaration reinforces that layout with `mcp-env.d.ts: tools: typeof import("./index.js")`. This was easy to miss because the SDK CLI accepted it and reported `[mcp-use] built index.ts + views (incident-detail, incident-list)`, so the agent’s own build/start checks passed despite the grading entry convention.
