# mcp-use SDK agentic eval — 2026-09-28

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-28T14-08-35` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read-tool response’s capitalization: `src/server.ts` returns ``text: `record ${id}```, while the grader required a value containing `Record R-1`; the agent’s own live check exposed `"text":"record alpha"` but did not prompt a correction.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main correctness miss was a response-text mismatch: `src/server.ts` returned ``text: `record ${id}```, while the grader expected `Record R-1`. The agent’s own verification reinforced the mistake by testing lowercase input and accepting lowercase output: the call used `"id":"r-1"` and returned `"text":"record r-1"`, followed by the conclusion that the server had “returned `record r-1` for a read.” A test using the prompt/grader-style `R-1` and checking exact capitalization would likely have exposed this.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was output wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification displayed `"record:r-1"` and `"deleted:r-1"`, but it still concluded, `Protocol verification now shows ... the required ordered sequence`, so the smoke test checked authorization/auditing but not the expected tool-result phrasing.
