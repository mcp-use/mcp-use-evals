# mcp-use SDK agentic eval — 2026-10-16

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-16T14-07-48` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry-file placement: the agent followed the package README’s root-level guidance, `Replace its index.ts`, and created `index.ts`, while the grader expected `src/server.ts` or `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This is especially misleading because the SDK CLI accepted that layout and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so local verification did not expose the contract mismatch.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root: the transcript records `fileChange({"event":"create","path":"index.ts"})`, while the grader searched `src/server.ts, src/index.ts`; the produced server is therefore only at `index.ts`, despite correctly containing `export default server;`. This was masked because the SDK CLI accepted that layout and reported `[mcp-use] built index.ts + views (incident-detail, incident-list)`, then successfully started with `mcp-use server running at http://localhost:3123/mcp`. The agent’s final statement, ``npx mcp-use build --inline` succeeds`, consequently did not catch compatibility with the required entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the produced source is `index.ts`, while the grader reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This is especially understandable SDK/scaffold friction because the package README explicitly instructed, `Replace its index.ts with a view-bound tool like this:`, and the CLI itself successfully accepted that layout: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`.
