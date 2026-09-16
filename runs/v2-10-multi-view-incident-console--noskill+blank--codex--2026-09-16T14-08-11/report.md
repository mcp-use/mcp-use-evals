# mcp-use SDK agentic eval — 2026-09-16

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-16T14-08-11` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at root `index.ts` rather than a discoverable entry under `src/`; the run itself listed only `./index.ts`, while the deterministic check reported `no entry file found (tried: src/server.ts, src/index.ts)`. The agent relied on an explicit local build that accepted this layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—so its verification did not expose the grader’s entry-discovery mismatch. The CLI help showed `--entry <path> Server entry module`, but the agent neither created `src/index.ts` nor verified the default entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was entry placement: the agent created root `index.ts` and reported that it “registers exactly `list_incidents` and `get_incident`,” while the deterministic entry lookup only tried `src/server.ts` and `src/index.ts`. This choice was encouraged by the SDK’s own scaffold: the inspected template listed `.tmp-scaffold/package/dist/templates/mcp-apps/index.ts`, and its `tsconfig.json` included `"index.ts"`. The SDK CLI also accepted it, reporting `[mcp-use] built index.ts + views (incident-detail, incident-list)`, so the local build gave no warning that the evaluation workflow would not discover that entry.
