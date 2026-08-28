# mcp-use SDK agentic eval — 2026-08-28

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-08-28T18-02-23` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool response wording rather than MCP behavior. `src/server.ts` returns ``text: `Read record ${id}```, while the deterministic check expected `Record R-1`; it also returns ``text: `Deleted record ${id}```, while the check expected lowercase `deleted R-1`. The agent’s live verification only confirmed that calls “returned normally” or “completed” — `read_record returned normally` and `an approved delete completed` — so it did not validate exact output substrings.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was the read tool’s response casing: `src/server.ts` returns ``text: `record ${id}```, while the grader expected `Record R-1`. The agent’s live check failed to expose this because it tested lowercase input and accepted lowercase output: ``"id":"r-1"`` produced ``"text":"record r-1"``; it then broadly concluded, `The four behavioral checks are passing`, without asserting the exact required read text.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than a skill or external docs: it ran `rg -n "streamable|Streamable|mcp:tools/call|server\\.use..." node_modules/mcp-use` and opened `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `middleware/mcp-middleware.d.ts`. Dependency compatibility caused a small detour: it first installed `zod@'^3.24.2'`, discovered MCP dependencies used `zod@4.5.1` via `npm ls zod`, then replaced it with `npm install zod@'^4.5.1'`.
