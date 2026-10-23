# mcp-use SDK agentic eval — 2026-10-23

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-23T14-08-16` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The central wrong turn was adopting the package template’s root-level entry: the agent inspected `dist/templates/mcp-apps/index.ts`, then created `index.ts`; the produced server is at `index.ts` with `export default server;`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. Local tooling masked this mismatch because `npx mcp-use build --inline` reported `[mcp-use] built index.ts + views ...`, and the agent consequently concluded that the requested workflow was verified.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root as `index.ts`; the grader searched only `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). The agent was plausibly guided there by the installed SDK README, which explicitly said `Replace its index.ts with a view-bound tool like this`, and the SDK CLI reinforced that choice by reporting `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. This is a notable scaffold/contract mismatch: local SDK build and runtime verification succeeded while the expected entry layout remained unmet.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive mistake was entry placement: the server was created as root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) rather than a conventional `src/index.ts` or `src/server.ts`. This was masked because the CLI auto-discovered and built it successfully: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent never noticed the grader-facing entry-path mismatch.
