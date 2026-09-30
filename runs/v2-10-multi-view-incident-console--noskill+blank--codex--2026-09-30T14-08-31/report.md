# mcp-use SDK agentic eval — 2026-09-30

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-30T14-08-31` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the produced registration file confirms the same assumption with `mcp-env.d.ts: tools: typeof import("./index.js");`. Although the local CLI accepted it—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—the required harness searched `src/server.ts` or `src/index.ts`, so the otherwise implemented server was undiscoverable. The agent never checked or created either conventional `src/` entry path; its final file listing named only `Server/tools: [index.ts]`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`; the produced source is `index.ts`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was reinforced by SDK guidance the agent inspected: the bundled README said `Replace its index.ts with a view-bound tool like this`, and the local CLI successfully reported `[mcp-use] built index.ts + views`, masking the grader’s expected entry convention. An explicit documented/scaffolded `src/index.ts` convention—or compatibility between CLI discovery and evaluation—would have prevented the failure.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the produced source is `index.ts` with `export default server;`. This was reinforced by the SDK README guidance the agent consulted: `Replace its index.ts with a view-bound tool like this`, and by the CLI’s successful but misleading confirmation, `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. Thus local build/start verification passed while the required entry layout remained undiscovered.
