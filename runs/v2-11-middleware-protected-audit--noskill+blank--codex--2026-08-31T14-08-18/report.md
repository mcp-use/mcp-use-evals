# mcp-use SDK agentic eval — 2026-08-31

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-31T14-08-18` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/2 |

## pass^k

pass^2: 0% (0/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was exact response wording: `src/server.ts` returns ``text: `Read record ${id}``` while the grader expected `Record R-1`, and returns ``text: `Deleted record ${id}``` while the grader expected lowercase `deleted R-1`. The agent’s own verification only checked that calls succeeded—`read_record succeeds` and `Approved deletion succeeds`—rather than asserting the required response substrings, even though it observed `"Read record alpha"` and `"Deleted record gamma"` on the wire.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive call-contract miss was capitalization: `src/server.ts` returns ``text: `Deleted record ${id}```, while the failed check reports `"Deleted record R-1" did not match ... "deleted R-1"`. The agent’s own verification reinforced rather than caught this mismatch by accepting `Deleted record gamma`.
