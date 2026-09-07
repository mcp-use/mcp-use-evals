# mcp-use SDK agentic eval — 2026-09-07

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-09-07T14-08-12` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-10-multi-view-incident-console | noskill+blank | 0/1 |

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.entry`: 1

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive integration mismatch was entry placement: the agent created `server.ts` at the repository root (`[tool] fileChange({"event":"create","path":"server.ts"})`), while the grader only tried `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was easy to miss because the SDK CLI accepted the root entry and reported `[mcp-use] built server.ts + views ... → .mcp-use/build/index.js`, while its installed discovery code explicitly included `"index.ts","index.tsx","server.ts","server.tsx"` in `node_modules/@mcp-use/cli/dist/chunk-FLGSKQGU.js`; the SDK workflow and grading convention therefore diverged.
