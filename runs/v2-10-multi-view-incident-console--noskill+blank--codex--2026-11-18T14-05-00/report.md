# mcp-use SDK agentic eval — 2026-11-18

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-18T14-05-00` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry point at repository root: `index.ts` contains `export default server;`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was encouraged by the SDK’s own README, which told the agent, `Replace its index.ts with a view-bound tool like this`, and the SDK build accepted that layout with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The mismatch between SDK documentation/build discovery and the grader’s expected `src/` convention caused every runtime contract check to be blocked despite the agent’s successful local verification.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive mistake was placing the server at repository-root `index.ts` rather than a conventional `src` entry; the final file listing shows `./index.ts` and no `src/server.ts` or `src/index.ts`: `find ...` → `./index.ts ... ./views/incident-list/view.tsx`. The agent explicitly saw that the CLI supports an override—`--entry <path> Server entry module`—but neither moved the file nor configured that option, so its successful local build of `index.ts` did not match the grader’s entry discovery.
