# mcp-use SDK agentic eval — 2026-11-04

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-04T14-06-10` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a response-text casing mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`; the agent’s own verification displayed `"text":"record alpha"` but only concluded ``read_record` succeeds`, so the end-to-end check did not validate the exact expected payload.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was response wording: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the grader expected substrings `Record R-1` and `deleted R-1`. The agent’s own verification reproduced those outputs—`"text": "record r-1"` and `"text": "deleted record r-1"`—but it still concluded, `The required call sequence now behaves correctly`, so the test checked protocol behavior without validating expected response text or capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was output casing: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check expected a substring `deleted R-1`; the grader reported `"Deleted record R-1" did not match {"type":"contains","value":"deleted R-1"}`. The agent’s manual verification used lowercase input—`"id":"r-1"`—and only checked that the call succeeded, observing `"Deleted record r-1"`, so it did not catch the case-sensitive expectation.
