# mcp-use SDK agentic eval — 2026-10-05

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-05T14-10-35` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at root `index.ts`; the grader only tried `src/server.ts` and `src/index.ts`, while the final file listing showed `./index.ts`. This was encouraged by the installed README’s scaffold wording, `Replace its index.ts with a view-bound tool like this`, and local CLI auto-discovery appeared successful with `[mcp-use] built index.ts + views`, masking the grader incompatibility.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root: the agent created `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader only searched `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). The SDK’s own local guidance likely encouraged this mismatch: `node_modules/mcp-use/README.md` said `Replace its index.ts`, and the CLI successfully reported `[mcp-use] built index.ts + views`, so the agent’s extensive runtime verification did not expose the grader-facing entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was choosing a root entry: the agent explicitly said it was creating the “`standard mcp-use entry point`” and created `index.ts`, while the generated registration also points to `typeof import("./index.js")` in `mcp-env.d.ts`. This worked locally—`[mcp-use] built index.ts + views ...`—but did not match the grader’s expected `src/server.ts` or `src/index.ts`, leaving an otherwise implemented server undiscoverable.
