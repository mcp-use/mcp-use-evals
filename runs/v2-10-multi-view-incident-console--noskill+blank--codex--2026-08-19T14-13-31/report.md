# mcp-use SDK agentic eval — 2026-08-19

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-19T14-13-31` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive integration miss was the entry location: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The SDK CLI masked this mismatch by successfully auto-detecting the root file: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent never tested the entry convention expected by the external workflow. The final inventory confirmed there was no `src/` entry: `./index.ts` plus the two `./views/.../view.tsx` files.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive mismatch was entry placement: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) and relied on the SDK’s successful auto-discovery message, `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, rather than adding the grader-discoverable `src/index.ts` or `src/server.ts`. The SDK documentation reinforced that choice with `Replace its index.ts with a view-bound tool like this`, making this a scaffold/discovery papercut despite local build and start succeeding.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The central miss was entry-file convention: the implementation was created at `index.ts`, and the agent relied on README guidance saying `Replace its \`index.ts\` with a view-bound tool like this`. Although the CLI accepted that layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—the required grading entry locations were `src/server.ts` or `src/index.ts`, so the otherwise working server was undiscoverable. The agent’s final claim, ``npx mcp-use build --inline` succeeds`, therefore masked a compatibility gap between the SDK CLI’s accepted convention and the evaluation/runtime entry convention.
