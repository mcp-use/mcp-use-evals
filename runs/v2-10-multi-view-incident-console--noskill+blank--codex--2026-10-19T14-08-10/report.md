# mcp-use SDK agentic eval — 2026-10-19

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-19T14-08-10` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root: the agent asserted, `“The framework’s conventions are clear: an index.ts default export”`, and produced `index.ts` with `export default server;`, but the deterministic harness only searched `src/server.ts` and `src/index.ts`. Local CLI success masked that layout mismatch: `“[mcp-use] built index.ts + views ... → .mcp-use/build/index.js”`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at root as `index.ts`; the produced file is `index.ts` with `export default server;`, while the deterministic check reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The SDK CLI reinforced this mismatch by accepting the layout and reporting `[mcp-use] built index.ts + views ...`, so the agent’s local build and extensive protocol verification did not expose the grader-facing entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root (`index.ts`) rather than a conventional grader-discoverable path such as `src/index.ts`; the generated declaration reinforces that layout with `mcp-env.d.ts: tools: typeof import("./index.js")`. The CLI accepted it—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—so the agent concluded success, but never checked entry discovery independently. This is a notable mismatch between CLI flexibility (`--entry <path> Server entry module`) and the expected default project structure.
