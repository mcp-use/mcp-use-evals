# mcp-use SDK agentic eval — 2026-09-23

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-23T14-08-01` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response-contract wording: `src/server.ts` returns ``text: `Read record ${id}``` and ``text: `Deleted record ${id}```, while the grader expected substrings `Record R-1` and `deleted R-1`; capitalization caused both call checks to fail even though the agent’s manual verification only confirmed its own outputs, e.g. `"Read record record-1"` and `"Deleted record record-1"`. The prompt did not explicitly prescribe those success strings, so this was an implicit grader expectation rather than an SDK issue.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader reports ``"record R-1" did not match ... "Record R-1"``. The agent’s live verification repeated the lowercase behavior—`"text":"record r-1"`—but concluded broadly that “`The live endpoint now accepts a read`,” so it checked protocol success rather than the expected payload text.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read-tool response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`; the agent’s manual check actually displayed `"text":"record r-1"` but it still concluded, `"The end-to-end MCP exchange is working"`. Using lowercase test input (`"id":"r-1"`) rather than the grader-style `R-1` also made this contract mismatch easier to overlook.
