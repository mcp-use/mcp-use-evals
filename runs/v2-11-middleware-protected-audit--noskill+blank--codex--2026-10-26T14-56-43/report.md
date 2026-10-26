# mcp-use SDK agentic eval — 2026-10-26

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-26T14-56-43` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was output casing: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check reports ``"Deleted record R-1" did not match {"type":"contains","value":"deleted R-1"}``. The agent’s live verification repeated the same capitalized output—`"text":"Deleted record record-1"`—so it confirmed execution but did not catch the grader-sensitive lowercase expectation.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool response wording: `src/server.ts` returns ``text: `read record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s end-to-end test did not catch this because it used a different identifier—`"id":"record-1"`—and only concluded that “`the approved deletion reached its handler`,” without asserting exact response text.
