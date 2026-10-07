# mcp-use SDK agentic eval — 2026-10-07

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-10-07T14-07-28` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`. The agent’s manual verification reinforced the wrong form because it only observed `"text":"record alpha"` and did not compare it against the grader’s expected wording.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response-string compatibility: `src/server.ts` returns ``text: `Read record ${id}``` while the grader expected text containing `Record R-1`; similarly it returns ``text: `Deleted record ${id}``` while the grader expected lowercase `deleted R-1`. The agent’s manual verification repeated those same forms—`"Read record record-1"` and `"Deleted record record-1"`—so it confirmed protocol success but did not catch the exact content/casing mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s verification reinforced the mistake rather than catching it: it tested lowercase `"id":"r-1"` and observed `"record:r-1"` / `"deleted:r-1"`, then concluded, `The live protocol checks succeeded`.
