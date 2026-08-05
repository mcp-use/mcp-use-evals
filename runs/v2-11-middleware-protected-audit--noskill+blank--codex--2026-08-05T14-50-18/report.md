# mcp-use SDK agentic eval — 2026-08-05

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-05T14-50-18` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a response-text capitalization mismatch: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`; the agent’s own verification only confirmed `"text":"record r-1"` and then concluded that “`read_record` succeeded,” so it never tested the grader-sensitive casing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read response’s capitalization: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check required a value containing `Record R-1`. The agent’s own verification used a different identifier and merely observed `"text":"record record-1"`, then concluded "`read_record` succeeds," so it did not test the grader-sensitive output form.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected text containing `Record R-1`. The agent’s own verification used lowercase input and accepted lowercase output—`"id":"r-1"` produced `"text":"record r-1"`—so it never exercised the grader’s exact `R-1` case or checked the expected capitalization.
