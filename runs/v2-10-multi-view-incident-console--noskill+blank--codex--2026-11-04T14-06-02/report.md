# mcp-use SDK agentic eval — 2026-11-04

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-04T14-06-02` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry-file placement: the agent created root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`) and later confirmed the project contained only `index.ts` rather than `src/index.ts` or `src/server.ts` (`rg --files ...` output: `index.ts`, `mcp-env.d.ts`, `package.json`, `tsconfig.json`, and views). This matched the package README it inspected—`Replace its index.ts with a view-bound tool like this:`—and the local CLI accepted it (`[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`), but it missed the evaluation scaffold’s expected entry location.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts`; the produced declaration also points there via `tools: typeof import("./index.js")` in `mcp-env.d.ts`. Although the SDK README explicitly encouraged this layout—`Replace its index.ts with a view-bound tool like this`—the grading harness only searched `src/server.ts` and `src/index.ts`, causing the reported `contract.entry` failure. The SDK CLI reinforced the incompatible choice by successfully reporting `[mcp-use] built index.ts + views (incident-detail, incident-list)`, so neither build nor the agent’s live checks exposed the entry-path mismatch.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts`, while the produced source is explicitly `index.ts`. This happened despite the CLI exposing `--entry <path>` and the agent never adding a conventional `src/` entry or persisting an explicit entry configuration.
