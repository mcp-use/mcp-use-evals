# mcp-use SDK agentic eval — 2026-08-05

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-05T14-50-22` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was wording on the explicit decline path: `src/server.ts` returns `approvalError("Deployment was not approved.")`, while the accepted response with `approve: false` returns `approvalError("Deployment was declined.")`. The deterministic check expected the explicit decline result to contain `decline`, so this inconsistency caused the failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main correctness miss was the decline wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` for `response.action === "decline" || response.action === "cancel"`, while the deterministic check reports that `"Deployment approval was not granted." did not match {"type":"contains","value":"decline"}`. The agent did use explicit decline wording for accepted `approve: false`—`terminalError("Deployment approval was declined.")`—but not for the direct decline action, an avoidable inconsistency that caused the contract failure despite the path being terminal.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was decline wording: `src/server.ts` returns `deploymentError("Deployment was not approved.")` for `response.action === "decline"`, while the deterministic check required the final result to contain `decline`. The agent separately used the clearer wording `deploymentError("Deployment was declined.")` for accepted responses with `approve: false`, but did not align the explicit-decline branch despite manually observing `"text":"Deployment was not approved."`.
