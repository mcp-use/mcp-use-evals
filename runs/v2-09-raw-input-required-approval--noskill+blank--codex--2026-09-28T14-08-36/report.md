# mcp-use SDK agentic eval — 2026-09-28

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-28T14-08-36` · batch `36433496813-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 0/2 |

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main miss was the decline wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` for protocol-level decline/cancel, while a separate `approve: false` branch returns `"Deployment approval was declined."`; the deterministic check expected the decline result to contain `decline`. The agent’s verification did not catch this because it only reported `"approval flow assertions passed"` and later claimed all non-approved cases were terminal, rather than asserting the required decline text.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline message: the action-based decline branch returns `terminalError("Deployment was not approved.")` (`src/server.ts`), while the grader expected text containing “decline.” The agent used the clearer wording only for accepted content with `approve: false`: `terminalError("Deployment was declined.")`. Its verifier checked only terminal shape—`declined.isError !== true`—so the successful output, `Verified accepted approval with note and terminal declined approval.`, did not validate the error text and missed the contract mismatch.
