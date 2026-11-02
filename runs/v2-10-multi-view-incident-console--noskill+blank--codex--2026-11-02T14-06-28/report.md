# mcp-use SDK agentic eval — 2026-11-02

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-02T14-06-28` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at root as `server.ts`, even though the grader required `src/server.ts` or `src/index.ts`; the produced file is `server.ts` with `export default server;`. This was especially avoidable because the SDK README the agent inspected said, `Replace its index.ts with a view-bound tool like this`, but the agent still created `server.ts`. The CLI’s permissive auto-discovery masked the integration mismatch by reporting `[mcp-use] built server.ts + views ... → .mcp-use/build/index.js`, so local build/start verification did not expose the grader’s entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root: the agent created `index.ts`, while the deterministic check only tried `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was reinforced by the installed SDK documentation, which said `Replace its index.ts with a view-bound tool like this`, and by the CLI successfully reporting `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`; the mismatch between CLI-supported layout and grader-required layout was therefore easy to miss.
