# mcp-use SDK agentic eval — 2026-08-21

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-21T14-13-39` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry point at repository root: `index.ts`, while the grader searched `src/server.ts` and `src/index.ts`. The local SDK workflow masked this mismatch because it reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, and `tsconfig.json` explicitly used `"include": ["index.ts", "views/**/*.tsx"]`. The generated registry reinforced the root layout with `mcp-env.d.ts: tools: typeof import("./index.js");`. Consequently, the agent’s final claim that “`npx mcp-use build --inline` succeeds” was true only for its chosen layout, not the required discoverable entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root: the produced file is `index.ts`, and the final inventory confirms only `./index.ts`, while the grader searched `src/server.ts` and `src/index.ts`. The SDK’s own build accepted this layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—so the agent’s successful local workflow masked the contract entry failure.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was entry placement: the agent created root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) after the scaffold advertised `index.ts (server entry point)`, while the grader only searched `src/server.ts` and `src/index.ts`. This is a scaffold/grader convention mismatch: the SDK itself successfully accepted the root entry—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but the submitted layout was not discoverable by the evaluation workflow.
