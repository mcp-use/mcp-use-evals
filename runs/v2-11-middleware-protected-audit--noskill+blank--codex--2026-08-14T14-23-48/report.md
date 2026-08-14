# mcp-use SDK agentic eval — 2026-08-14

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-14T14-23-48` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a case-sensitive response mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected output containing `Record R-1`; the agent’s own live check only observed `"text":"record record-1"` and declared success without testing the grader-shaped value.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The functional architecture worked, but the run failed on response-text mismatches: `src/server.ts` returned ``text: `Read record ${id}``` while the grader expected a substring `Record R-1`, and returned ``text: `Deleted record ${id}``` while the grader expected lowercase `deleted R-1`. The agent’s live verification reproduced those strings—`"Read record r-1"` and `"Deleted record r-1"`—but it concluded broadly that “The verified calls produced the required outcomes,” so the verification checked authorization behavior rather than contract-sensitive response text.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was response wording rather than MCP behavior: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks required `Record R-1` and `deleted R-1`. The agent’s live verification reinforced the wrong strings because it tested `alpha` and accepted `record alpha` and `deleted record alpha` without checking the expected contract wording.
