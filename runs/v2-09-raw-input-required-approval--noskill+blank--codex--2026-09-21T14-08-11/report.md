# mcp-use SDK agentic eval — 2026-09-21

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-21T14-08-11` · batch `35609921166-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was a wording mismatch in the terminal decline result: `src/server.ts` returns `deploymentError("Deployment was not approved.")`, while the grader required the final result to contain `decline`. The agent’s own verification only checked shape—`declined.isError !== true || "inputRequests" in declined`—so it confirmed terminal behavior but never asserted decline-specific text.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was inconsistent decline messaging in `src/server.ts`: an explicit decline/cancel returns `terminalError("Deployment was not approved.")`, while only an accepted response with `approve: false` returns `terminalError("Deployment was declined.")`. The local decline test checked only `assert.equal(declined.isError, true)` and `assert.equal("inputRequests" in declined, false)` in `test/approval-flow.ts`, so it did not catch the grader’s required `"decline"` substring.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline error wording: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check required the final result to contain `decline`. The agent verified only terminal behavior and concluded success from `{"text":"Deployment was not approved.","isError":true}`, but did not test the expected decline-specific wording; its summary likewise claimed merely that `Declined approval returned one terminal error result`.
