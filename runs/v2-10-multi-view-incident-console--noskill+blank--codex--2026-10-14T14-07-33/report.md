# mcp-use SDK agentic eval — 2026-10-14

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-14T14-07-33` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, producing `entry: FAIL — no entry file found`. This is especially notable because the CLI exposed an escape hatch—`--entry <path> Server entry module`—but the agent ran `npx mcp-use build --inline` and `npx mcp-use start` without it. The SDK’s own build output, `[mcp-use] built index.ts + views`, likely reinforced a locally valid layout that did not satisfy the expected entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive mistake was placing the server at root `index.ts` rather than a discoverable `src/server.ts` or `src/index.ts`; the produced source is `index.ts`, and the agent explicitly reported the build as ``[mcp-use] built index.ts + views ...``. This was masked because the SDK CLI accepted that layout locally, while the deterministic entry check did not.
