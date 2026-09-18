# mcp-use SDK agentic eval — 2026-09-18

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-18T14-07-54` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, and the agent’s own verification showed `"text":"record alpha"`, but the contract expected `Record R-1`. The agent declared that it had verified “the expected tool results” without checking the exact read-result wording, focusing instead on deletion and audit behavior: `The endpoint now returns the expected tool results: the unapproved deletion is an MCP error...`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was response casing: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check reports ``did not match {"type":"contains","value":"deleted R-1"}``. The agent’s manual test used a different ID and only checked broad success—`"Deleted record example"`—then concluded, `"the approved delete runs"`, so it never tested the grader-sensitive lowercase substring.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main correctness miss was tool response wording: `src/server.ts` returns ``text: `Read record ${id}` `` while the grader expected text containing `Record R-1`; deletion returns ``text: `Deleted record ${id}` `` while the grader expected lowercase `deleted R-1`. The agent’s live verification saw these exact outputs—`"Read record r-1"` and `"Deleted record r-1"`—but concluded that “`The live checks confirm the read and both delete paths`,” so it validated protocol behavior without checking likely output-string expectations.
