# mcp-use SDK agentic eval — 2026-10-05

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-05T14-10-36` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was semantic output wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the required checks expected “Record R-1” and “deleted R-1.” The agent’s own verification reinforced these exact strings—`"read":"record:r1"` and `"approved":"deleted:r1"`—but did not compare them against the grader-facing wording.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response-text compatibility: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the expected phrases were “Record R-1” and “deleted R-1.” The agent’s manual verification only checked that calls succeeded, accepting transcript outputs `"record:r-1"` and `"deleted:r-1"` without asserting exact expected text; its summary likewise said only `"Approved deletion succeeds."`
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was response-text compatibility: `src/server.ts` returns ``text: `Read record ${id}``` and ``text: `Deleted record ${id}```, while the deterministic checks required substrings `Record R-1` and `deleted R-1`; the capitalization and extra “Read” caused both call failures. The agent’s own verification reproduced these outputs—`"Read record record-1"` and `"Deleted record record-1"`—but concluded only that the calls were “allowed,” so it did not scrutinize exact result text.
