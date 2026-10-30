# mcp-use SDK agentic eval — 2026-10-30

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-10-30T14-06-41` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was placing the server at root `index.ts`, supported by the SDK README’s instruction, `Replace its index.ts with a view-bound tool like this`, while the grader searched only `src/server.ts, src/index.ts`; the produced entry is `index.ts:1` (`import { MCPServer } from "mcp-use";`). This is a significant scaffold/contract mismatch because the SDK itself successfully accepted that layout: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the entry point at repository root: `index.ts`, while the contract expected `src/server.ts` or `src/index.ts`; the produced declaration reinforced that layout with `mcp-env.d.ts: tools: typeof import("./index.js");`. This was easy to miss because the SDK CLI accepted it: `built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`, and `mcp-use server running at http://localhost:3100/mcp`. The agent therefore reported success—`npx mcp-use build --inline succeeds`—despite the grader being unable to locate an entry file.
