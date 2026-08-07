# mcp-use SDK agentic eval — 2026-08-07

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-07T14-23-36` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced declaration also points there with `mcp-env.d.ts: tools: typeof import("./index.js");`. Although the local CLI accepted this—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—the supplied contract check required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The agent never tested or mirrored those conventional entry paths, so extensive successful runtime verification did not protect against the entry failure.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root: the produced server is `index.ts`, while the deterministic check reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The SDK’s bundled README likely reinforced this choice because its quickstart says `Replace its \`index.ts\` with a view-bound tool like this`, and the CLI itself successfully reported `[mcp-use] built index.ts + views (incident-detail, incident-list)`, exposing a convention mismatch between the SDK workflow and the expected scaffold layout.
