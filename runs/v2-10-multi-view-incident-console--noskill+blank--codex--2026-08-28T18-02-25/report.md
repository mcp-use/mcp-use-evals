# mcp-use SDK agentic eval — 2026-08-28

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-28T18-02-25` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced declaration also points to `typeof import("./index.js")` in `mcp-env.d.ts`, while the grader searched only `src/server.ts` and `src/index.ts`. This was easy to miss because the SDK build explicitly accepted the root file: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, and start later reported `mcp-use server running at http://localhost:3000/mcp`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive issue was entry placement: the agent created root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader searched only `src/server.ts` and `src/index.ts`. This was reinforced by the SDK README quickstart saying `Replace its index.ts` and showing “`index.ts — Server entry file`,” and the CLI itself successfully reported `built index.ts + views ... → .mcp-use/build/index.js`; the local build therefore gave no warning that the evaluation entry convention differed.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at repository root as `index.ts`; the produced source is `index.ts`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was masked by the SDK CLI accepting that layout and reporting `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent never created the grader-compatible `src/server.ts` or `src/index.ts`.
