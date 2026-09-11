# mcp-use SDK agentic eval — 2026-09-11

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-11T14-08-08` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts` rather than a conventional `src/server.ts` or `src/index.ts`; the produced source is explicitly `### index.ts`, and generated typing reinforced that choice with `mcp-env.d.ts: tools: typeof import("./index.js")`. Local mcp-use accepted it—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but this layout was incompatible with the grader’s entry discovery, so all runtime checks were blocked despite the agent’s extensive local verification.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at root `index.ts` (`export default server;`) instead of a discoverable entry such as `src/index.ts`; the CLI build accepted it—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—but the grader reports it only tried `src/server.ts, src/index.ts`, so the submission lacked the expected entry layout. The agent never tested clean entry discovery against that convention and concluded, `The production build and live MCP endpoint are working.`
