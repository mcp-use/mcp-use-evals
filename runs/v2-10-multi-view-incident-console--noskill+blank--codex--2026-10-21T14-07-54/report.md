# mcp-use SDK agentic eval — 2026-10-21

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-21T14-07-54` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced entry is `index.ts`, while the grader reports `no entry file found (tried: src/server.ts, src/index.ts)`. The SDK’s own guidance likely encouraged this mismatch: the agent read `node_modules/mcp-use/README.md`, whose quickstart says `Replace its index.ts`, and the SDK build accepted it with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. Thus local build/start verification passed while the expected contract entry remained absent.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root: the produced server is `index.ts` with `export default server;`, while the deterministic grader reports `no entry file found (tried: src/server.ts, src/index.ts)`. This was encouraged by the installed SDK README, which said `Replace its \`index.ts\` with a view-bound tool`, and the local build reinforced it with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`; the scaffold/docs and evaluation entry convention were therefore misaligned.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; although the SDK reported `[mcp-use] built index.ts + views`, the grader required `src/server.ts` or `src/index.ts` and reported `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. The agent therefore completed extensive runtime verification against an entry layout the contract harness could not discover, concluding “`Verified: ... npx mcp-use start serves MCP at /mcp`” despite the entry failure.
