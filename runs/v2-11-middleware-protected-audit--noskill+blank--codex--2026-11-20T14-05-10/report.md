# mcp-use SDK agentic eval — 2026-11-20

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-20T14-05-10` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a response-text mismatch: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check reports that `"record R-1"` did not match ... `"Record R-1"`; the agent’s live test used `"id":"record-1"` and accepted `"text":"record record-1"`, so it never tested the grader-sensitive capitalization and input.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s own live verification confirmed those exact outputs—`"text":"record:record-1"` and `"text":"deleted:record-1"`—but it treated successful protocol calls as sufficient rather than checking expected user-facing text.
