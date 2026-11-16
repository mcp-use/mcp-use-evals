# mcp-use SDK agentic eval — 2026-11-16

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-16T14-16-12` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive miss was project layout: the server was created at root as `index.ts`, while the grader only searched `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). The agent’s own final inventory showed only `./index.ts`, yet it concluded “`Verified 2 tools, 2 HTML MCP App resources, and independent result view bindings.`”; testing through the SDK CLI therefore did not catch the grader-facing entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts` rather than a discoverable graded entry such as `src/index.ts`; the grader reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`, while the final file inventory showed only `./index.ts`. The SDK CLI accepted this layout and masked the portability problem: `npx mcp-use build --inline` reported `built index.ts + views ... → .mcp-use/build/index.js`, and the agent concluded “`The project now builds successfully`” without testing the expected entry convention or passing `--entry`.
