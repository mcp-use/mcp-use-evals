# mcp-use SDK agentic eval — 2026-08-21

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-21T14-13-37` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The substantive miss was a case-sensitive response mismatch: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check required text containing `deleted R-1`. The agent’s manual verification did not expose this because it only confirmed ``"text":"Deleted record record-1"`` and accepted that output without testing the grader-style `R-1` or lowercase substring.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response-text compatibility, not MCP behavior: `src/server.ts` returns ``text: `Read record ${id}``` and ``text: `Deleted record ${id}```, while the grader expected substrings `Record R-1` and `deleted R-1`; capitalization and the extra “Read” placement caused both call checks to fail. The agent manually observed these exact outputs—`"Read record alpha"` and `"Deleted record gamma"`—but treated successful protocol responses as sufficient rather than checking deterministic wording.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was response-text compatibility: `src/server.ts` returned `Read record ${id}` and `Deleted record ${id}`, while the deterministic checks expected substrings `Record R-1` and `deleted R-1`; capitalization made both fail even though the live verification only confirmed outputs such as `"Read record alpha"` and `"Deleted record beta"` without asserting the required text.
