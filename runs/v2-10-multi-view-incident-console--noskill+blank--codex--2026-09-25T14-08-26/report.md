# mcp-use SDK agentic eval — 2026-09-25

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-25T14-08-26` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/1 |

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 1

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry-file placement: the agent followed the package README’s root-entry example, quoted as `Replace its index.ts with a view-bound tool like this`, and created `index.ts`, while the grader required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This is a notable convention mismatch because the SDK itself successfully accepted the root file: `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`.
