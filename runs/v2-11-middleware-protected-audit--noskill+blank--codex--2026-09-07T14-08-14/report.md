# mcp-use SDK agentic eval — 2026-09-07

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-07T14-08-14` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the deterministic check expected text containing `Record R-1`. The agent’s live verification reinforced the mistake rather than catching it because it tested `id: "record-1"` and accepted the result `"text":"record record-1"` as intended.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The agent spent several exploratory calls reverse-engineering the SDK from installed declarations and README rather than using a skill or fetched docs, including `rg -n "streamable|use\\(|resource|McpServer|createServer|tools/call" node_modules/mcp-use` and repeated reads of `node_modules/mcp-use/dist/server.d.ts`, `middleware/mcp-middleware.d.ts`, and `README.md`. This indicates API-shape discovery friction around middleware, resources, and transport.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool-result wording: `src/server.ts` returns ``text: `read record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks expected substrings `Record R-1` and `deleted R-1`; the extra word in `deleted record R-1` and lowercase `read record R-1` caused both call failures. The agent’s live verification did not catch this because it only observed its own outputs—`"read record record-1"` and `"deleted record record-3"`—without asserting expected text.
