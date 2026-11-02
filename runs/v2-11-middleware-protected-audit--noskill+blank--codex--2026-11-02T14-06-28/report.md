# mcp-use SDK agentic eval — 2026-11-02

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-02T14-06-28` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader required text containing `Record R-1` and `deleted R-1`. The agent’s own verification displayed `"record:read-1"` and `"deleted:delete-approved"`, but it accepted those outputs without checking the expected presentation.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The key miss was the approved-delete response casing: `src/server.ts` returns ``text: `Deleted record ${id}```, and the agent’s verification confirmed `"Deleted record r-1"`. Because it tested with lowercase ID `"id":"r-1"` and only observed success rather than checking the required matcher literally, it did not catch the grader-sensitive difference between `Deleted` and `deleted`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a case-sensitive response mismatch: `src/server.ts:43` returns ``text: `record ${id}```, while the grader required `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s own live check exposed the lowercase output — `"text":"record read-1"` — but it only verified successful transport, not the expected payload text.
