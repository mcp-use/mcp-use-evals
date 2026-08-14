# mcp-use SDK agentic eval — 2026-08-14

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-14T14-23-51` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the grader required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found`. The SDK itself reinforced this layout by saying `[mcp-use] built index.ts + views ...`, so a locally successful build did not expose the grader-facing entry mismatch. The generated declaration also locked onto the root path: `mcp-env.d.ts` contains `tools: typeof import("./index.js");`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root: `index.ts` contains `export default server;`, while the grader only searched `src/server.ts` and `src/index.ts`. This was especially avoidable because the agent inspected entry discovery with `rg -n "entry|index.ts|mcp-env" node_modules/@mcp-use/cli/dist`, yet still created `index.ts`; the local CLI then reinforced the mistake by accepting it and reporting `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`.
