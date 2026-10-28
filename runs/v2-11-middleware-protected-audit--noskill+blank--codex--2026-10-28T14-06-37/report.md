# mcp-use SDK agentic eval — 2026-10-28

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-28T14-06-37` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was tool response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s own live verification surfaced the exact outputs—`"record:alpha"` and `"deleted:alpha"`—but it accepted them as correct and concluded, `The live endpoint has accepted the read ... and accepted the approved delete`, so the final verification did not check expected human-readable phrasing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was in tool response wording: `src/server.ts` returns ``text: `read record ${id}``` and ``text: `deleted record ${id}```, while the grader reported expected substrings `Record R-1` and `deleted R-1`. The agent’s manual checks repeated those same non-grader inputs and outputs—`"id":"record-1"` produced `"read record record-1"` and `"deleted record record-1"`—so verification confirmed transport behavior but did not catch the response-contract mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`. The agent’s live check did not catch this because it tested `id: "record-1"` and accepted the output `"text":"record record-1"` without asserting an expected string.
