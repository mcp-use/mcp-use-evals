# mcp-use SDK agentic eval — 2026-11-13

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-13T14-05-17` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main miss was the terminal decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check required the final result to contain “decline.” The agent’s own verification confirmed that exact response—`"text":"Deployment was not approved."`—but concluded, `The live protocol check passed`, so the manual test checked terminality and `isError` without matching the grader’s expected decline language.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while the grader reports that `"Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent did use “declined” for accepted content with `approve: false`—`return terminalError("Deployment was declined.");`—but did not align the explicit decline/cancel branch, despite directly verifying the response as `"text":"Deployment was not approved."`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the explicit decline branch: `src/server.ts` returns `approvalError(environment, "Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`. That message does not contain “decline,” matching the reported failure: `did not match {"type":"contains","value":"decline"}`. Ironically, the separate accepted-but-false branch used `"Deployment was declined."`, so reusing that wording for an actual decline would likely have avoided the contract-call failure.
