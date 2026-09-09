# mcp-use SDK agentic eval — 2026-09-09

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-09T14-07-37` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `contract.calls`: 2
- `contract.resources`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the approved-delete response wording: `src/server.ts` returns ``text: `Record ${id} deleted` ``, while the grader expected a substring shaped as `deleted R-1`; the agent’s live check only confirmed its own output, ``"text":"Record record-1 deleted"``, and then declared that it “`permits the approved deletion`” without checking the required wording/order.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was response-text compatibility: `src/server.ts` returns ``text: `Read record ${id}``` and ``text: `Deleted record ${id}```, while the deterministic checks expected case-sensitive substrings `Record R-1` and `deleted R-1`. The agent’s manual verification reinforced these choices rather than testing likely contract wording: it called with lowercase `"id":"r-1"` and accepted `"Read record r-1"` and `"Deleted record r-1"` as success.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The agent had to discover the SDK API by grepping installed declarations—`rg -n "Streamable|streamable|server\\.use|mcp:tools/call|createMcp" node_modules/mcp-use`—and then reading `node_modules/mcp-use/dist/server.d.ts`, middleware declarations, tools, and resources; no skill file or fetched documentation URL appears in the transcript.
