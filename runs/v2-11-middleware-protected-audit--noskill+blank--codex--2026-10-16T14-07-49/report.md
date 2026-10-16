# mcp-use SDK agentic eval — 2026-10-16

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-16T14-07-49` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected the substring `Record R-1`. The agent’s own verification reproduced `"text":"record record-1"` but still concluded it had returned “the expected read result,” so the manual check lacked an explicit expected-value assertion and failed to catch the mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was tool-result wording: `src/server.ts` returns ``text: `read record ${id}` `` and ``text: `deleted record ${id}` ``, while the deterministic checks expected substrings `Record R-1` and `deleted R-1`. The agent’s manual verification repeated its own wording—`"text":"read record r-1"` and `"text":"deleted record r-1"`—so it confirmed execution but did not test likely exact response expectations; the final summary only said ``read_record` succeeds` and `Approved delete succeeds`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a case-sensitive response mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`. The agent’s own verification reinforced the mistake because it called with lowercase `"id":"r-1"` and accepted the response `"text":"record r-1"` rather than testing the grader-style capitalization.
