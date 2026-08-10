# mcp-use SDK agentic eval — 2026-08-10

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-10T14-27-02` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was response-text compatibility: `src/server.ts` returns `text: \`Read record ${id}\`` and `text: \`Deleted record ${id}\``, while the grader expected substrings `Record R-1` and lowercase `deleted R-1`. The agent’s live check merely echoed those same outputs—`"Read record record-1"` and `"Deleted record record-1"`—so verification did not test the grader-sensitive wording or casing.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was a response-contract detail in `src/server.ts`: the read handler returns ``text: `record ${id}``` with lowercase `record`, while the grader expected `Record R-1`. The agent even verified only the same lowercase behavior—`"text":"record alpha"`—so its manual check did not catch the capitalization mismatch.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The agent leaned heavily on installed package internals for API discovery, reading `node_modules/mcp-use/README.md` and declarations such as `node_modules/mcp-use/dist/server.d.ts`, then grepping for middleware/request shapes with `rg -n '"tools/call"|CallToolRequest'`. This consumed several exploratory calls, including a dead-end path error: `node_modules/@modelcontextprotocol/server/dist/esm/types.d.ts: No such file or directory`.
