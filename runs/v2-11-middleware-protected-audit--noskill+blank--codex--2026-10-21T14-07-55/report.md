# mcp-use SDK agentic eval — 2026-10-21

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-21T14-07-55` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a response-text casing mismatch: `src/server.ts` returns ``text: `record ${id}` `` while the grader expected text containing `Record R-1`; the agent’s own verification used lowercase input and accepted `“text\":\"record r-1\"`, so it never tested the grader-sensitive capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was tool-response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification reproduced these exact formats—`"record:read-1"` and `"deleted:delete-2"`—but it concluded, `The protocol checks succeeded`, so the manual check validated behavior without checking likely response-text expectations.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was an output-casing mismatch: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check expected the substring `deleted R-1`. The agent’s live verification reproduced `"Deleted record record-1"` but accepted it without checking exact contract-sensitive casing: `data: {"result":{"content":[{"type":"text","text":"Deleted record record-1"}]...}`.
