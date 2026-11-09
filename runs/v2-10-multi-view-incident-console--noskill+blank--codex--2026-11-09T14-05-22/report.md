# mcp-use SDK agentic eval — 2026-11-09

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-09T14-05-22` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`, while the grader required `src/server.ts` or `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was reinforced by SDK guidance: the README said `Replace its index.ts`, and grepping the installed CLI showed candidates including `"index.ts"` alongside `"src/index.ts"`. The local build therefore reported success—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but that did not match the evaluation harness’s narrower entry convention. A safer scaffold-compatible choice would have been `src/index.ts`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts` rather than a conventional `src` entry; the grader reported `no entry file found (tried: src/server.ts, src/index.ts)`, while the agent’s local build explicitly accepted the different layout: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. This created misleading confidence because both `npx mcp-use build --inline` and the manually started server worked, yet the required entry discovery failed.
