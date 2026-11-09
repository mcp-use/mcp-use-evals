# mcp-use SDK agentic eval — 2026-11-09

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-09T14-05-25` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was tool-result wording: `src/server.ts` returns ``text: `record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks expected `Record R-1` and `deleted R-1`. The agent’s end-to-end verification reinforced those outputs rather than catching the mismatch: it tested lowercase `"id":"r-1"` and observed `"record r-1"` and `"deleted record r-1"`, then concluded, `The live MCP checks succeeded`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was tool output wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s own verification exposed these exact forms—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but it treated them as successful without checking expected presentation.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was deterministic response wording: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the grader expected text containing `Record R-1` and `deleted R-1`. The agent’s live verification reinforced these choices rather than checking likely expected phrasing: it called with lowercase `"id":"r-1"` and accepted `"record:r-1"` and `"deleted:r-1"` as successful outputs.
