# mcp-use SDK agentic eval — 2026-09-04

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-04T14-07-36` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was an output-case mismatch in `src/server.ts`: the approved handler returns ``text: `Deleted record ${id}```, while the deterministic check expected a case-sensitive substring `deleted R-1`. The agent’s own verification did not catch this because it tested a different ID and accepted the capitalized response: `"text":"Deleted record record-1"`, then concluded that “the approved delete [had] produced the expected three audit entries.”
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was validating behavior against self-chosen output strings rather than the expected record phrasing: `src/server.ts:59` returns ``text: `record:${id}``` and `src/server.ts:73` returns ``text: `deleted:${id}```, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The live test reinforced this mistake because it used lowercase `r-1` and accepted its own outputs: `"text":"record:r-1"` and `"text":"deleted:r-1"`, followed by the unsupported conclusion, `Live MCP verification succeeded`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main correctness miss was tool response formatting: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s own verification confirmed those exact colon-form outputs—`read_record → record:record-1` and `approved delete → deleted:record-1`—but treated them as successful, so end-to-end testing did not detect the hidden call contract mismatch.
