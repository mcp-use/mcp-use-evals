# mcp-use SDK agentic eval — 2026-08-26

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-26T14-17-03` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at root as `index.ts`; the build reported `built index.ts + views ... → .mcp-use/build/index.js`, while the produced tree contains `./index.ts` and no `src/server.ts` or `src/index.ts`. This made the implementation incompatible with the grader’s expected entry locations despite local CLI success.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root: the produced server is `index.ts` with `export default server;`, while the deterministic check reports `no entry file found (tried: src/server.ts, src/index.ts)`. This is especially notable because the SDK itself accepted that layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—so successful local build/start verification did not expose the grader’s expected entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at repository root as `index.ts`; the produced declaration confirms `tools: typeof import("./index.js")`, while the deterministic environment only searched `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This is especially confusing because the installed CLI advertised broader discovery: `["src/index.ts", ... "index.ts", ...]`, and the agent’s local build explicitly succeeded with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The SDK/CLI convention therefore diverged from the grading/start convention, and the agent never tested a `src/` entry.
