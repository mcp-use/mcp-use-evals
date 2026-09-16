# mcp-use SDK agentic eval — 2026-09-16

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-16T14-08-07` · batch `35106265310-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected a value containing `Record R-1`. The agent’s live check reinforced rather than caught this mismatch because it used `"id":"record-1"` and accepted `"text":"record record-1"` as successful verification.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read response’s capitalization: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`; the agent’s verifier reinforced the same incorrect assumption with `if (textFrom(read) !== "record record-1")`, so its successful `npm run verify` could not catch the contract mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was output-contract wording: `src/server.ts` returned `Read record ${id}` and `Deleted record ${id}`, while the deterministic checks expected substrings `Record R-1` and lowercase `deleted R-1`. The agent’s live verification only confirmed that calls completed—`"Read record record-1"` and `"Deleted record record-1"`—and its conclusion, `"Protocol-level verification succeeded"`, did not test the expected response text or casing.
