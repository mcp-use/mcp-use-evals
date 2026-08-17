# mcp-use SDK agentic eval — 2026-08-17

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-17T14-08-39` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/2 |

## pass^k

pass^2: 0% (0/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read response’s capitalization: `src/server.ts` returns ``text: `record ${id}```, while the grader expected a string containing `Record R-1`. The agent’s own verification exposed the lowercase output—`"text":"record record-1"`—but it treated that as success: `Protocol checks confirm the read succeeds`, so the test was too permissive to catch the contract mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main correctness miss was tool response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s own verification only validated transport success and printed `"record:r-1"` / `"deleted:r-1"`, so it never checked the expected human-readable formatting.
