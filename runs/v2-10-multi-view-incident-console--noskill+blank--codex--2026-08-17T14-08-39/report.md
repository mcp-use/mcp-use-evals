# mcp-use SDK agentic eval — 2026-08-17

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-17T14-08-39` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at repository root as `index.ts`; the grader only searched `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was easy to miss because the SDK accepted that layout and reported success: `built index.ts + views ... → .mcp-use/build/index.js`, while the source itself correctly had `export default server;` (`index.ts`). The agent therefore completed extensive runtime verification against a layout incompatible with the external entry contract, including `mcp-use server running at http://localhost:3210/mcp` and successful `tools/call get_incident`, but never checked the expected `src/` convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at project root: `index.ts`, while the grader searched only `src/server.ts` and `src/index.ts`; the generated registration reinforced that layout with `mcp-env.d.ts: tools: typeof import("./index.js");`. The SDK CLI accepted this non-contract location, masking the problem: `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, and the agent therefore concluded, “`npx mcp-use build --inline` passes.” The CLI help exposed an explicit override—`--entry <path> Server entry module`—but the agent neither used it nor moved the file under `src/`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root: the produced server is `index.ts` with `export default server;`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was masked because the SDK’s own build accepted it: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent’s verification did not match the grader’s entry convention.
