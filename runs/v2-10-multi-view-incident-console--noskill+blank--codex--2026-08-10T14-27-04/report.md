# mcp-use SDK agentic eval — 2026-08-10

Run `v2-10-multi-view-incident-console--noskill+blank--codex--2026-08-10T14-27-04` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `contract.entry`: 2
- `contract.resources`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 1 — [trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t1/memo.md): The decisive wrong turn was entry-file placement: the implementation was created as root `index.ts` (`[tool] fileChange({"event":"create","path":"index.ts"})`), while the grader searched only `src/server.ts` and `src/index.ts` (`entry: FAIL — no entry file found (tried: src/server.ts, src/index.ts)`). This was masked by the SDK’s local workflow, which explicitly reported success for that layout: `[mcp-use] built index.ts + views (incident-detail, incident-list) → .mcp-use/build/index.js`. The generated typing also reinforced the root entry by importing `./index.js` in `mcp-env.d.ts`.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 2 — [trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t2/memo.md): The agent leaned heavily on installed-package discovery after the registry README attempt failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`; it then inspected `node_modules/mcp-use/README.md`, multiple `dist/*.d.ts` files, and grepped `node_modules` for API and protocol shape.
- `v2-10-multi-view-incident-console` · `noskill+blank` · trial 3 — [trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md](trials/v2-10-multi-view-incident-console--noskill+blank--t3/memo.md): The decisive wrong turn was placing the entry at the repository root: `index.ts` contains `export default server;`, while the deterministic grader reports `no entry file found (tried: src/server.ts, src/index.ts)`. This is especially notable because the agent inspected CLI internals showing broader discovery—`var i=["src/index.ts","src/index.tsx","src/server.ts","src/server.tsx","index.ts","index.tsx","server.ts","server.tsx"]`—and its local build confirmed `[mcp-use] built index.ts + views`; local CLI behavior therefore masked the grader’s narrower entry expectation.
