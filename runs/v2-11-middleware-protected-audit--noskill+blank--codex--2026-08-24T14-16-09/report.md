# mcp-use SDK agentic eval — 2026-08-24

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-24T14-16-09` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected text containing `Record R-1`. The agent’s own live verification showed `"text":"record alpha"`, but it accepted that result without aligning the output to the grader-sensitive form.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was not SDK behavior but verification against the expected tool text: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected `Record R-1` and `deleted R-1`. The agent’s live checks merely confirmed its own outputs—`"record:r-1"` and `"deleted:r-1"`—then overclaimed that `End-to-end protocol checks now pass`, without checking the required capitalization and spacing.
