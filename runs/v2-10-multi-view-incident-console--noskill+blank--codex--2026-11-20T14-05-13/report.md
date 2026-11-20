# mcp-use SDK agentic eval — 2026-11-20

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-20T14-05-13` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts` (`export default server;`) rather than a conventional graded entry such as `src/index.ts`; despite the local CLI reporting `[mcp-use] built index.ts + views`, the deterministic check could not find an entry among `src/server.ts, src/index.ts`. The agent never reconciled that layout mismatch because all local commands auto-discovered the root file.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at root `index.ts`; the grader only searched `src/server.ts` and `src/index.ts`, while the agent’s own build output reinforced the incompatible layout with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The CLI exposed an entry override—`--entry <path> Server entry module`—but the agent neither moved the file under `src/` nor configured a conventional entry path.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive miss was entry placement: the agent created root-level `index.ts` with `export default server;`, while the grader reported `no entry file found (tried: src/server.ts, src/index.ts)`. This is understandable discovery friction because grepping the installed CLI showed root entries were valid candidates: `["src/index.ts", ... "index.ts", ...]`, and the CLI itself successfully reported `[mcp-use] built index.ts + views`. The agent therefore verified the SDK workflow but not the evaluator’s narrower entry convention.
