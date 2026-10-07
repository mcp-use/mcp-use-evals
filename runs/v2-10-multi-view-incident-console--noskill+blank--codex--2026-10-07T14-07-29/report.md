# mcp-use SDK agentic eval — 2026-10-07

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-07T14-07-29` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry placement: the agent created root `index.ts` after reading the SDK README’s instruction, `Replace its index.ts with a view-bound tool like this`, and the CLI reinforced that choice with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. However, the deterministic harness only searched `src/server.ts` and `src/index.ts`, so the otherwise working implementation was undiscoverable. This is a scaffold/contract mismatch the agent’s own successful build did not expose.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The central wrong turn was entry placement: the agent followed the package README’s root-entry guidance, quoting `Replace its index.ts with a view-bound tool like this`, and created `index.ts`; the grader expected `src/server.ts` or `src/index.ts`, so the otherwise working implementation was unreachable under the contract. This mismatch was easy to miss because the SDK CLI explicitly accepted it: `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, and start reported `mcp-use server running at http://localhost:3000/mcp`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive miss was entry-file placement: the agent created root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) and trusted the SDK build message, `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, but never created `src/server.ts` or `src/index.ts`; the final file listing confirms only `./index.ts`. This is a scaffold/contract discovery gap because the package README explicitly guided it toward root placement: `Replace its index.ts with a view-bound tool like this:`.
