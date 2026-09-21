# mcp-use SDK agentic eval — 2026-09-21

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-21T14-08-12` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check reports `"record R-1" did not match ... "Record R-1"`. The agent’s own end-to-end test reinforced the mistake because it used lowercase input—`"id":"r-1"`—and accepted the resulting `"text":"record r-1"` without checking the expected capitalized response.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The implementation missed the grader’s exact response-text expectations: `read_record` returned `Read record R-1`, which “`did not match ... "Record R-1"`,” and approved deletion returned `Deleted record R-1`, which “`did not match ... "deleted R-1"`.” The agent’s live verification did not catch these case-sensitive wording mismatches because it only observed `"Read record record-1"` and `"Deleted record record-1"` and then concluded, “`the approved deletion completed successfully`.”
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s manual verification reproduced those exact forms—`"record:r-1"` and `"deleted:r-3"`—but still concluded “`read_record` succeeds” and “Approved deletion succeeds,” so the smoke test checked protocol success rather than expected user-visible content.
