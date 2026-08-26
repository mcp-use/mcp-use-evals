# mcp-use SDK agentic eval — 2026-08-26

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-26T14-17-07` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool-result wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s own end-to-end verification confirmed the mismatching forms—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but it still concluded that “`read_record` succeeds” and “`Approved delete succeeds`,” so verification checked protocol success rather than expected response semantics.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was deterministic response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the grader expected strings containing `Record R-1` and `deleted R-1`. The agent’s own verification confirmed the mismatched forms—`"text":"record:r-1"` and `"text":"deleted:r-1"`—but it still concluded, `The end-to-end MCP exchange now passes`, so the manual checks validated protocol flow without checking expected user-facing text or casing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The decisive miss was the read tool’s output casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected `Record R-1`. The agent’s live verification reinforced the mistake rather than catching it, using lowercase input and accepting `"text":"record r-1"` before reporting “the read was allowed.”
