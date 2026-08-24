# mcp-use SDK agentic eval — 2026-08-24

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-24T14-16-07` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 0/3 |

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main correctness miss was the decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while the deterministic check required text containing `decline`. The separate `approve: false` branch did use `terminalError("Deployment was declined.")`, so the two negative paths were inconsistently worded.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was decline-result wording: `src/server.ts` returns `deploymentDenied("Deployment was not approved.")`, while the deterministic check required the final result to contain `decline`. The agent’s own direct-function test printed `{"isError":true,"content":[{"type":"text","text":"Deployment was not approved."}]}`, but it concluded this was “the expected wire shape” without checking the likely textual expectation.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was inconsistent decline wording in `src/server.ts`: accepted `{ approve: false }` returns `"Deployment approval was declined."`, while an elicitation decline/cancel returns `"Deployment approval was not granted."`. The latter caused the deterministic failure because it did not contain `decline`, even though the agent’s live check showed exactly `"text":"Deployment approval was not granted."` and it concluded only that the response was terminal: `"a declined retry returning a complete isError result with no further input request."`
