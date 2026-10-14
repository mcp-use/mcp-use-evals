# mcp-use SDK agentic eval — 2026-10-14

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-14T14-07-47` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s live verification reinforced the wrong contract because it accepted `record:record-1` and `deleted:record-1`, then concluded, “`The live checks passed`,” without asserting expected response text.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was tool-output wording: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks expected `Record R-1` and `deleted R-1`. The agent’s own verification reproduced `"record r-1"` and `"deleted record r-1"` but only checked that calls completed, so it did not catch capitalization or the extra word `record`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The substantive miss was tool-result wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s manual verification reinforced rather than caught this mismatch because it used `"id":"record-1"` and accepted responses `"record:record-1"` and `"deleted:record-1"` without checking the grader-facing phrasing.
