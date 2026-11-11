# mcp-use SDK agentic eval — 2026-11-11

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-11T14-05-17` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry placement: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader only searched `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found`). The SDK README likely encouraged this mismatch: it explicitly said `Replace its index.ts`, and the SDK itself successfully reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. This is a notable scaffold/contract papercut: the SDK workflow accepted an entry location the external contract did not.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the grader required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This was especially easy to miss because the SDK CLI accepted that layout and printed `[mcp-use] built index.ts + views (incident-detail, incident-list)`, then successfully started with `mcp-use server running at http://localhost:3123/mcp`. The agent therefore concluded success—`The MCP protocol checks confirm the expected distinct resource URIs`—without checking the evaluator’s expected entry convention. The produced declaration also reinforced the root layout: `mcp-env.d.ts` contains `tools: typeof import("./index.js");`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at root `index.ts`; the grader only tried `src/server.ts` and `src/index.ts`, while the agent followed the installed README’s instruction, `Replace its index.ts with a view-bound tool like this:`. This is a scaffold/contract mismatch: the local CLI accepted it—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but the deterministic entry check could not discover it.
