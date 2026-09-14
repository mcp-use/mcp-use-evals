# mcp-use SDK agentic eval — 2026-09-14

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-14T14-08-35` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader reported `"record R-1" did not match ... "Record R-1"`. The agent’s manual verification reproduced the lowercase output—`"text":"record record-1"`—but treated the call as verified, so it did not catch the exact-content expectation.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was in tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the required grader-visible phrases were `Record R-1` and `deleted R-1`. The agent’s own verification printed `"text": "record:r-1"` and `"text": "deleted:r-1"`, but it treated those as success: `Verified: - read_record succeeds.` This suggests the verification checked only protocol success, not expected content.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a response-format mismatch in `src/server.ts` (`text: \`record ${id}\``): the grader expected `Record R-1`, but received `"record R-1"`. The agent’s own verification used lowercase input and only checked that the call completed—`"arguments":{"id":"r-1"}` produced `"text":"record r-1"`—so it did not catch the capitalization contract.
