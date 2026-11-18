# mcp-use SDK agentic eval — 2026-11-18

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-18T14-04-57` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response wording rather than MCP behavior: `src/server.ts` returns ``text: `Read record ${id}``` while the grader expected a string containing `Record R-1`, and returns ``text: `Deleted record ${id}``` while the grader expected lowercase `deleted R-1`. The agent’s manual verification did not catch this because it only observed `"Read record record-1"` and `"Deleted record record-1"` and then declared that “the read call has already passed” and the approved path was checked, without asserting expected text or casing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was tool response wording: `src/server.ts` returned ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s wire verification confirmed only its own outputs—`"text":"record:r1"` and `"text":"deleted:d1"`—so it did not test against the expected human-readable contract.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was deterministic tool-output wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the contract checks expected text containing `Record R-1` and `deleted R-1`. The agent’s live verification only confirmed its own outputs—`"text":"record:r-1"` and `"text":"deleted:r-1"`—without comparing them against expected wording, then concluded that “`The live protocol checks now show the required read ... and approved deletion`.”
