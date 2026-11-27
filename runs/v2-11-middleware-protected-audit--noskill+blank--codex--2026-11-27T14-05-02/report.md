# mcp-use SDK agentic eval — 2026-11-27

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-27T14-05-02` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was behavioral output wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification exposed these exact outputs—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but it treated successful protocol responses as sufficient and did not validate expected user-facing phrasing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`; the agent’s own verification showed `"text":"record record-1"` but still concluded, `"The three tool calls behave correctly"`. Testing with `"id":"record-1"` rather than the grader-style `R-1` also made this exact-output mismatch easier to overlook.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool-response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s live verification reproduced those exact outputs—`"text":"record:one"` and `"text":"deleted:three"`—but treated them as successful, so the checks validated transport behavior without catching response-format incompatibility.
