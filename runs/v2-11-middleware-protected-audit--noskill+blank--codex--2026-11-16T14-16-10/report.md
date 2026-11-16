# mcp-use SDK agentic eval — 2026-11-16

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-16T14-16-10` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification used `alpha` and accepted `record:alpha` / `deleted:alpha` without checking likely contract-facing phrasing: `The protocol checks succeeded`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification reinforced the wrong format—`read_record → record:r-1` and `delete_record (approved) → deleted:r-1`—so its end-to-end checks did not mirror the expected assertions.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected “Record R-1” and “deleted R-1.” The agent’s own live check exposed these exact forms—`"text":"record:alpha"` and `"text":"deleted:alpha"`—but it treated them as successful because it verified only `read_record → allowed` and `delete_record (APPROVE-DELETE) → allowed`, rather than checking expected response text.
