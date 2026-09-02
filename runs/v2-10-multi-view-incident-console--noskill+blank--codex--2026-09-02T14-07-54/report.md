# mcp-use SDK agentic eval — 2026-09-02

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-02T14-07-54` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root: produced source has `index.ts`, while no `src/server.ts` or `src/index.ts` was created. Local tooling reinforced this mistake because it reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent concluded the workflow was valid without checking the grader’s conventional entry paths.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at repository root: produced `index.ts` contains `export default server;`, while the grader reports `no entry file found (tried: src/server.ts, src/index.ts)`. The agent saw SDK documentation describing root placement—README output said `Replace its index.ts`—and the CLI itself successfully reported `[mcp-use] built index.ts + views ...`, so local SDK behavior did not expose the grader’s required entry convention.
