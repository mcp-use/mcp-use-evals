# mcp-use SDK agentic eval — 2026-11-25

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-25T14-05-33` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool-result wording, not the middleware or audit implementation: `src/server.ts` returns ``text: `record:${id}``` and ``text: `deleted:${id}```, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s own verification reinforced the wrong format because it tested `record-1` and accepted responses `"record:record-1"` and `"deleted:record-1"` without checking the expected human-readable spacing/capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The agent relied on package metadata and installed declarations rather than a skill file or external docs, first querying `npm view mcp-use@2.0.4` and then grepping `node_modules/mcp-use/dist` for `"server\\.use|Streamable|streamable|registerTool|resource"` and reading `server.d.ts`, `mcp-middleware.d.ts`, and `resources.d.ts`.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The main miss was tool-result wording. `src/server.ts` returns ``text: `Read record ${id}``` and ``text: `Deleted record ${id}```, while the grader expected substrings `Record R-1` and `deleted R-1`; capitalization caused both call failures. The agent’s manual verification did not catch this because it only checked successful responses using `"id":"record-1"` and observed `"Read record record-1"` / `"Deleted record record-1"` without asserting expected text.
