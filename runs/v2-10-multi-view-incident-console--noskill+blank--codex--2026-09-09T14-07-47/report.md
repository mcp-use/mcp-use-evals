# mcp-use SDK agentic eval — 2026-09-09

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-09T14-07-47` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive compatibility miss was entry placement: the agent created a root-level entry (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the produced source contains no `src/index.ts` or `src/server.ts`. The CLI accepted this layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—which likely masked the scaffold/contract expectation. Although CLI help exposed `--entry <path>`, the agent neither used it nor mirrored the conventional `src/` layout.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was entry placement: the SDK README explicitly said `Replace its index.ts`, but the agent created root-level `server.ts` (`[tool] fileChange({"event":"create","path":"server.ts"})`). Although the CLI accepted it—`built server.ts + views ... → .mcp-use/build/index.js`—the grader only searched `src/server.ts` and `src/index.ts`, so the otherwise implemented server was undiscoverable.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was entry-file placement: the agent followed package guidance saying `Replace its index.ts` and created root `index.ts`, while the grader required `src/server.ts` or `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was especially misleading because the SDK workflow accepted that layout: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so local build/start verification did not expose the contract mismatch.
