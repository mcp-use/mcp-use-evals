# mcp-use SDK agentic eval — 2026-08-10

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-10T14-29-02` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 0/1 |

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was decline wording: the cancellation/decline branch returns `approvalError("Deployment approval was not granted.")` in `src/server.ts`, while only accepted content with `approve: false` reaches `approvalError("Deployment was declined.")`. The live decline test exposed the exact problematic result—`"text":"Deployment approval was not granted."`—but the agent still concluded that “decline returned one terminal `isError: true` result,” overlooking the expected decline-specific text.
