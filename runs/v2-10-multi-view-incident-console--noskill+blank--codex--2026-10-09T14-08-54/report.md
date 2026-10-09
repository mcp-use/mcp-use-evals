# mcp-use SDK agentic eval — 2026-10-09

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-09T14-08-54` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive mistake was placing the server at root-level `index.ts` rather than a conventional grader-discoverable entry: the produced source is `index.ts`, while the generated registration also points to `typeof import("./index.js")` in `mcp-env.d.ts`. The agent’s own local build masked this integration mismatch because it reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`; it never tested discovery from `src/server.ts` or `src/index.ts`, despite the CLI help exposing `--entry <path>`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was choosing a root entry at `server.ts` rather than `src/server.ts` or `src/index.ts`. The agent explicitly concluded, “`server.ts` default-exports the server,” and the CLI reinforced this with “`built server.ts + views ... → .mcp-use/build/index.js`,” but the produced entry remained only `server.ts` (`export default server;`). This local CLI success masked the entry-layout incompatibility that blocked external evaluation.
