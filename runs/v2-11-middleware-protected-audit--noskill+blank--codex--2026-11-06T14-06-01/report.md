# mcp-use SDK agentic eval — 2026-11-06

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-06T14-06-01` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive contract miss was a case-sensitive response mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s own verification reinforced the mistake by testing `id: "alpha"` and accepting `"text":"record alpha"` rather than checking the expected capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected text containing `Record R-1`. The agent’s own verification reinforced the wrong output without checking compatibility, observing `"text":"record alpha"` and then proceeding.
