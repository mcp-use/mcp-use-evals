# mcp-use SDK agentic eval — 2026-09-25

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-25T14-08-26` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/1 |

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s output casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected text containing `Record R-1`; the agent’s own verification only checked and reported `read=record r-1`, so it did not catch the contract mismatch.
