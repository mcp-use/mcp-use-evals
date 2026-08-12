# mcp-use SDK agentic eval — 2026-08-12

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-12T14-27-37` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive mistake was entry-point placement: the agent created root-level `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) rather than `src/server.ts` or `src/index.ts`, which left the grader unable to discover the server despite the local CLI reporting `built index.ts + views`. The agent had seen the CLI’s explicit override option, ``--entry <path> Server entry module``, but did not use it or align the layout with the expected conventional entry path.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The central papercut was an entry-point convention mismatch: the agent followed the installed SDK README’s root-entry example—`Replace its index.ts with a view-bound tool like this`—and created `./index.ts`, while the external workflow searched only `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was especially misleading because the SDK itself accepted that layout and reported `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, and `mcp-use start` reported `mcp-use server running at http://localhost:3100/mcp`. The produced declaration reinforced the root convention with `typeof import("./index.js")` in `mcp-env.d.ts`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced source is `index.ts`, while the task’s graded entry convention expected `src/server.ts` or `src/index.ts`. This was avoidable after the CLI explicitly exposed `--entry <path> Server entry module`, but the agent relied on auto-discovery because the local build reported `[mcp-use] built index.ts + views ...`. Thus extensive successful local verification did not exercise the grader’s entry lookup.
