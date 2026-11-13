# mcp-use SDK agentic eval — 2026-11-13

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-13T14-05-19` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The correctness miss was a response-format mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s manual verification did not catch this because it tested `"id":"record-1"` and accepted the resulting `"text":"record record-1"` without checking the expected capitalization or the grader’s `R-1` case.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The run failed only on response-text expectations: the grader reports `record:R-1` did not match `Record R-1`, and `deleted:R-1` did not match `deleted R-1`. The implementation hard-coded these mismatches in `src/server.ts` as ``text: `record:${id}``` and ``text: `deleted:${id}```. The agent’s end-to-end verification merely confirmed its own strings—`"text":"record:alpha"` and `"text":"deleted:charlie"`—so it did not catch the contract mismatch before finishing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool-result wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s manual verification reinforced those incorrect formats rather than catching them: it accepted `read_record` returning `record:alpha` and approved deletion returning `deleted:alpha`, then concluded, “The live endpoint now returns the expected read result.”
