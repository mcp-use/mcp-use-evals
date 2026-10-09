# mcp-use SDK agentic eval — 2026-10-09

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-09T14-08-51` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was an output-format mismatch: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`; the grader reported ``"record R-1" did not match ... "Record R-1"``. The agent’s manual verification reproduced the lowercase behavior—`"text":"record r-1"`—but treated it as successful because it only exercised the endpoint rather than checking the expected response string. Its final summary then said `Verified successfully` despite not validating read output semantics.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was deterministic response wording, not SDK integration: `src/server.ts` returned ``text: `record ${id}``` while the grader expected `Record R-1`, and returned ``text: `deleted record ${id}``` while the grader expected `deleted R-1`. The agent’s live verification did not catch this because it used `"id":"record-1"` and accepted outputs `"record record-1"` and `"deleted record record-1"` as successful, then concluded, `"the authorization path is behaving as intended"`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was the read-tool response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected output containing `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s manual check failed to expose this because it called with lowercase `"id":"r-1"` and accepted `"text":"record r-1"` as correct.
