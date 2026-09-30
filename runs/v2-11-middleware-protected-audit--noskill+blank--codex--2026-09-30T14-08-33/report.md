# mcp-use SDK agentic eval — 2026-09-30

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-09-30T14-08-33` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/2 |

## pass^k

pass^2: 0% (0/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The decisive miss was a response-format mismatch in `src/server.ts`: the read handler returns ``text: `record ${id}``` with lowercase “record,” while the grader expected text containing `Record R-1`. The agent’s live check did not catch this because it called with lowercase input—`"id":"r-1"`—and accepted the response `"text":"record r-1"` without asserting exact expected content.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The substantive miss was tool response wording: `src/server.ts` returns ``text: `record:${id}` `` and ``text: `deleted:${id}` ``, while the deterministic checks expected strings containing `Record R-1` and `deleted R-1`. The agent’s own verification merely echoed those outputs—`"text": "record:r1"` and `"text": "deleted:r1"`—without asserting the required human-readable format, so the final clean run did not catch the contract mismatch.
