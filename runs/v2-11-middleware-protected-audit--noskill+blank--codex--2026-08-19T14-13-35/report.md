# mcp-use SDK agentic eval — 2026-08-19

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-19T14-13-35` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a response-text capitalization mismatch: `src/server.ts` returns ``text: `record ${id}```, while the contract expected `Record R-1`; the agent’s own verification displayed `"text": "record r-1"` but only concluded “Read succeeds,” so the end-to-end check did not assert the required exact casing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was tool response wording: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the grader expected substrings `Record R-1` and `deleted R-1`. The agent’s live verification used lowercase input—`"id":"r-1"`—and accepted outputs `"record r-1"` and `"deleted record r-1"`, so it never tested the exact expected `R-1` strings or assertions beyond successful protocol responses.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was tool response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s live check reinforced these exact outputs—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but only checked that calls succeeded, concluding “`read_record` succeeds” and “Approved deletion succeeds,” so it never tested output compatibility.
