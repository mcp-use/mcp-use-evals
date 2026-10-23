# mcp-use SDK agentic eval — 2026-10-23

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-23T14-08-09` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool-result wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s live verification reinforced the wrong format because it accepted outputs shown as `"record:record-1"` and `"deleted:record-1"` and then concluded, `Protocol checks now pass`; a stricter assertion against expected response text would have caught both failures.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`. The agent’s own verification exposed the lowercase output twice—`"text":"record r1"` and later `"text": "record r1"`—but it did not compare that result against the likely contract wording before finishing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a capitalization mismatch in `src/server.ts`: the read handler returns ``text: `record ${id}``` while the grader expected `Record R-1`. The agent’s own verification reinforced the mistake rather than catching it because it tested lowercase input and accepted lowercase output: `read_record` was called with `"id":"r-1"` and returned `"text":"record r-1"`.
