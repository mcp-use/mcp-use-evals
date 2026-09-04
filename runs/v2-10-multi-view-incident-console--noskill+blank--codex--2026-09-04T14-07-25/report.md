# mcp-use SDK agentic eval — 2026-09-04

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-04T14-07-25` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The main wrong turn was adopting the package template’s root entry layout: the agent unpacked `create-mcp-use-app@2.0.6`, saw `package/dist/templates/mcp-apps/index.ts`, and created `index.ts` with `export default server;`. Local tooling accepted it — `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js` — but the grader expected `src/server.ts` or `src/index.ts`, resulting in `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This is a scaffold/convention mismatch: the SDK’s own template and CLI validated a layout that the evaluation workflow could not discover.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was entry placement: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader searched `src/server.ts` and `src/index.ts`, producing `entry: FAIL — no entry file found`. This was especially misleading because the SDK CLI accepted that layout and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent’s own build/start verification did not expose the contract mismatch.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The central wrong turn was placing the entry at repository root: the produced file is `server.ts`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was especially costly because the SDK’s own auto-discovery accepted it—`[mcp-use] built server.ts + views ... → .mcp-use/build/index.js`—so repeated local build/start verification did not expose the packaging mismatch. The agent inspected CLI internals extensively, including `rg -n "entry.*index|index\\.ts|views.*view\\.tsx|--inline" node_modules/mcp-use/node_modules/@mcp-use/cli`, but still did not choose a conventional `src/server.ts` entry or pass an explicit entry arrangement compatible with the grader.
