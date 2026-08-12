# mcp-use SDK agentic eval — 2026-08-12

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-12T14-27-36` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read response’s capitalization: `src/server.ts` returns ``text: `record ${id}```, and the live check confirmed `"text":"record r1"`, while the grader expected `Record R-1`. The agent’s self-verification only checked that a read completed—`“the read was allowed”`—rather than asserting the exact response text, so this mismatch escaped despite the end-to-end test.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The key miss was output casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`; the agent’s own verification only exercised lowercase input/output, showing `"id":"r-1"` and `"text":"record r-1"`, so it did not catch the contract mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The substantive miss was output casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s end-to-end check did not catch this because it tested lowercase input and merely observed `"text":"record r-1"` without asserting the expected capitalization.
