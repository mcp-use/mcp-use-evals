# mcp-use SDK agentic eval — 2026-11-13

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-11-13T14-05-17` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry-file placement: the agent asserted, `“The framework’s current CLI conventions expect the server entry at the project root”`, then created `index.ts`, while the grader only searched `src/server.ts` and `src/index.ts`; this left an otherwise implemented server undiscoverable. The CLI’s permissive local behavior reinforced that mistake because the build reported, `[mcp-use] built index.ts + views (incident-detail, incident-list)`, so the agent never tested against the expected scaffold layout.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The decisive wrong turn was placing the server at repository-root `index.ts` rather than a grader-recognized entry path: the produced source is `index.ts`, while the deterministic result says `no entry file found (tried: src/server.ts, src/index.ts)`. This is especially notable because the agent relied on package documentation that stated `index.ts — Server entry file for tool definition and metadata`, and the SDK itself accepted that layout with `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`. The SDK/CLI convention therefore appeared valid locally but did not align with the expected project entry convention.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at root `index.ts`; the grader searched only `src/server.ts` and `src/index.ts` and reported `entry: FAIL — no entry file found`. This was easy to miss because the SDK CLI successfully auto-discovered the root file: `[mcp-use] built index.ts + views ... → .mcp-use/build/index.js`, and start then reported `mcp-use server running at http://localhost:3100/mcp`. The CLI help only exposed an override—`--entry <path> Server entry module`—without revealing the grader/scaffold’s expected default location, creating a convention mismatch despite a locally working build.
