# mcp-use SDK agentic eval — 2026-09-04

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-04T14-07-21` · batch `33881746910-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was error wording: `src/server.ts` returns `approvalError("Deployment was not approved.")` for both explicit decline/cancel and `approve: false`, while the deterministic check required the decline result to contain `decline`. The agent’s own verification only checked shape—`d.result?.resultType !== "complete" || d.result?.isError !== true || d.result?.inputRequests !== undefined`—so it never asserted decline-specific text and incorrectly concluded, `Declined approval: verified one terminal error result with no inputRequests`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was not SDK behavior but terminal-error wording: `src/server.ts` returns `"Deployment was not approved."` for both explicit decline and false approval, while the deterministic check reports `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent manually verified only terminal shape, then concluded too broadly that “`The HTTP checks passed`”; its decline curl indeed showed `"isError":true` and `"resultType":"complete"`, but the text lacked “decline,” so the verification did not mirror the grader’s content expectation.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline error wording: `src/app.ts` returns `approvalError("Deployment was not approved.")`, while the deterministic check expected the final result to contain “decline.” The agent’s direct verification was too weak to catch that contract mismatch: it only reported `"text": "Deployment was not approved."` and concluded that “a declined response produces a single terminal error result,” without asserting the required decline wording.
