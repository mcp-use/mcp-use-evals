# mcp-use SDK agentic eval — 2026-11-23

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-23T14-05-42` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry placement: the agent explicitly chose “`the framework’s conventional root entry (index.ts)`” after the packaged README said “`Replace its index.ts`,” and produced `index.ts`, while the grader required `src/server.ts` or `src/index.ts` (`entry: FAIL — no entry file found`). This is a documentation/scaffold mismatch: `npx mcp-use build --inline` accepted the root file and reported “`built index.ts + views ... → .mcp-use/build/index.js`,” masking the grader-facing entry problem.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository root as `index.ts` rather than a recognized grader entry such as `src/index.ts`; the agent’s own final file listing showed only `index.ts`, and generated typing reinforced that choice with `mcp-env.d.ts: tools: typeof import("./index.js");`. This passed the SDK’s local auto-discovery—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but left the required entry undiscoverable outside that workflow.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was entry placement: the agent created root-level `index.ts` and `server.ts`, with `index.ts` containing `export { default } from "./server.js";`, rather than placing an entry under `src/`. This was reinforced by the package README it consulted, which said, `Replace its index.ts with a view-bound tool like this:`; the local CLI then confirmed the misleading layout with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. Thus its local build/start verification did not expose the evaluator’s expected entry convention.
