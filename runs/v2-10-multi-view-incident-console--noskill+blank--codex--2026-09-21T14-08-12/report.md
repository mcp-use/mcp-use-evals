# mcp-use SDK agentic eval — 2026-09-21

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-21T14-08-12` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the entry at repository root as `index.ts`; the produced declaration also points there (`mcp-env.d.ts`: `tools: typeof import("./index.js");`), while the deterministic workflow searched only `src/server.ts` and `src/index.ts`. The agent relied on the CLI accepting this layout—`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`—and consequently reported success as `Default server export in .../index.ts`, without checking the expected conventional entry path.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the grader reports `no entry file found (tried: src/server.ts, src/index.ts)`, while the produced entry is `index.ts` with `export default server;`. The agent’s local SDK workflow reinforced that choice: the inspected scaffold contained `dist/templates/blank/index.ts`, and its build reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. This is a compatibility/discovery papercut: local `mcp-use` accepted the scaffold-style root entry, but the evaluation/start contract expected `src/server.ts` or `src/index.ts`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entrypoint at repository root: the transcript shows `fileChange({"event":"create","path":"index.ts"})`, while the grader searched only `src/server.ts, src/index.ts`. This was easy to miss because the SDK CLI accepted that layout and reported `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, then successfully served `mcp-use server running at http://localhost:3100/mcp`. The agent therefore finished with confidence—`npx mcp-use build --inline succeeds` and `PORT=3100 npx mcp-use start serves MCP at /mcp`—despite producing no contract-recognized entry file.
