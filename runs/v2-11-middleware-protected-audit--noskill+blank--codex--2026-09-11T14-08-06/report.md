# mcp-use SDK agentic eval — 2026-09-11

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-11T14-08-06` · batch `34608153638-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was in tool response wording: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the grader expected “Record R-1” and “deleted R-1.” The agent’s own verification exposed those exact outputs—`"text":"record r-1"` and `"text":"deleted record r-1"`—but it concluded, `The core behavior is working`, without checking expected response text or capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`; the failure explicitly says `"record R-1" did not match ... "Record R-1"`. The agent’s verification reinforced its own lowercase assumption rather than checking the task-facing expected form: the live result was `"read": "record record-1"` and the agent still concluded the sequence was “ordered exactly as intended.”
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a case-sensitive response mismatch: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`. The agent’s live verification reproduced the lowercase output—`"text":"record r-1"`—but did not compare it against the expected capitalization.
