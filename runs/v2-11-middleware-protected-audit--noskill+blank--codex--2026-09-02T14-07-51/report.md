# mcp-use SDK agentic eval — 2026-09-02

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-02T14-07-51` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The implementation missed the grader’s exact response substrings even though the agent manually verified successful calls. `src/server.ts` returns ``text: `Read record ${id}``` while the check expected `Record R-1`, and returns ``text: `Deleted record ${id}``` while the check expected lowercase `deleted R-1`. The live tests reinforced these outputs—`"Read record record-1"` and `"Deleted record record-1"`—but the agent concluded that the required behavior was confirmed without checking likely response wording.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The key correctness miss was a casing mismatch in the read response: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`. The agent’s own verification reinforced the mistake by testing `id: "record-1"` and accepting `"text":"record record-1"` rather than checking the expected `R-1` output.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was response casing: `src/server.ts` returns ``text: `Deleted record ${id}```, while the deterministic check expected the case-sensitive substring `deleted R-1`. The agent’s manual verification used a different identifier and accepted `"Deleted record record-1"`, then concluded, `"the approved call reaches the handler"`, so it never tested the grader’s exact expected text.
