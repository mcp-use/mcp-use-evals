# mcp-use SDK agentic eval — 2026-10-12

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-12T14-14-09` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main correctness miss was not SDK-related but an unchecked response-format assumption: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification only confirmed generic success—`"text":"record:read-1"` and `"text":"deleted:delete-approved"`—so it did not test the expected human-readable wording.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive wrong turn was tool response formatting: `src/server.ts` returned ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader reported `"record:R-1" did not match ... "Record R-1"` and `"deleted:R-1" did not match ... "deleted R-1"`. The agent’s live check did not assert expected strings; it merely observed `"text":"record:record-1"` and `"text":"deleted:record-1"`, then concluded, `"the approved delete proceeded successfully"`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read-tool response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader required a value containing `Record R-1` and reported `"record R-1" did not match ... "Record R-1"`. The agent’s own live check exposed this exact output—`"text":"record r-1"`—but it only concluded that “`read_record` succeeds,” so the verification checked protocol success rather than the expected content and used lowercase `"id":"r-1"` instead of the grader’s `"R-1"`.
