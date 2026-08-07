# mcp-use SDK agentic eval — 2026-08-07

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-07T14-23-33` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 3

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main correctness miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`; the agent’s own verification only confirmed `"text":"record record-1"` and did not test the grader’s `R-1` case.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was tool-output wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected substrings `Record R-1` and `deleted R-1`. The agent’s own live verification repeated those forms—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but still concluded, `Verification passed`, so the end-to-end check validated authorization and ordering without checking the expected response text.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool-result formatting: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected `Record R-1` and `deleted R-1`. The agent’s manual verification reinforced the wrong strings rather than checking likely contract wording: it accepted `"text":"record:alpha"` and `"text":"deleted:alpha"`, then concluded, `End-to-end protocol checks now pass`.
