# mcp-use SDK agentic eval — 2026-10-19

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-19T14-08-10` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was a capitalization mismatch in the read tool: `src/server.ts` returns ``text: `record ${id}```, while the grader expected output containing `Record R-1`. The agent’s own verification exposed this exact lowercase response—`"text":"record read-1"`—but it only concluded that “`read_record` succeeds,” so the end-to-end check validated protocol success rather than the required content.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was a response-text casing mismatch: `src/server.ts` returns ``text: `record ${id}```, while the grader expected a value containing `Record R-1`. The agent’s own live check exposed `"text":"record read-1"`, but it declared that “`Protocol verification succeeded`” without checking the expected capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected a value containing `Record R-1`. The agent’s manual verification reinforced the mistake because it called the tool with lowercase `"id":"r-1"` and accepted `"text":"record r-1"` without checking the expected capitalization.
