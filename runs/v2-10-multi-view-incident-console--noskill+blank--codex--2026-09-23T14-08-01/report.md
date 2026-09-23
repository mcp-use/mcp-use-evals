# mcp-use SDK agentic eval — 2026-09-23

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-23T14-08-01` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts` rather than a conventional `src/server.ts` or `src/index.ts`; the produced entry is `index.ts` with `export default server;`. This went unnoticed because the SDK accepted it locally: `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, and the agent concluded, `Built the deterministic TypeScript MCP Apps incident console.`
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`, while the reported contract searched only `src/server.ts` and `src/index.ts`; the agent even confirmed the build target as ``built index.ts + views ... → .mcp-use/build/index.js`` but never moved it under `src/` or supplied a persistent entry configuration. The CLI exposed an escape hatch—``--entry <path> Server entry module``—but the agent did not use it in the final commands, which remained ``npx mcp-use build --inline`` and ``npx mcp-use start``.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the server at root `index.ts`; the produced-file list contains `index.ts` but no `src/server.ts` or `src/index.ts`, while the grader reports `entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`. This was easy to miss because the SDK CLI accepted the layout and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, so the agent concluded “Verified successfully” despite the external entry convention.
