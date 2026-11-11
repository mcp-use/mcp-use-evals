# mcp-use SDK agentic eval — 2026-11-11

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-11T14-05-17` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response wording, not MCP behavior: `src/server.ts` returns ``text: `Read record ${id}``` while the check required `Record R-1`, and returns ``text: `Deleted record ${id}``` while the check required lowercase `deleted R-1`. The agent’s live verification reproduced both strings—`"Read record record-1"` and `"Deleted record record-1"`—but still concluded, `End-to-end verification passed`, so it did not validate outputs against the expected substrings.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was a response-text mismatch: `src/server.ts:68` returns ``text: `record ${id}```, while the grader expected `Record R-1`. The agent’s own verification exposed the lowercase output—`"text":"record record-1"`—but it only checked that the call succeeded, not the required capitalization or the grader’s likely input.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was a response-format assumption: `src/server.ts` returns `text: \`record ${id}\``, while the grader expected the case-sensitive substring `Record R-1`. The agent’s own verification reproduced the lowercase output—`"text":"record one"`—but treated it as successful, so the end-to-end check did not validate the expected user-facing wording.
