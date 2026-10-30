# mcp-use SDK agentic eval — 2026-10-30

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-30T14-06-41` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected “Record R-1” and “deleted R-1.” The agent’s own verification exposed the exact outputs—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but it concluded that “`The four requested operations now work`” without checking likely consumer-facing text conventions.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the required grader expectations were `Record R-1` and `deleted R-1`. The agent’s own verification reproduced these exact outputs—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but treated successful protocol calls as sufficient and concluded “`read_record` succeeds” and “Approved deletion succeeds,” without checking expected text conventions.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main correctness miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification reinforced these mismatches without questioning them: it observed `"text":"record:record-1"` and `"text":"deleted:record-2"` and still concluded “Verified” successfully.
