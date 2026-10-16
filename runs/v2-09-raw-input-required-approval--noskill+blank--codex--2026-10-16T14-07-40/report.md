# mcp-use SDK agentic eval — 2026-10-16

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-16T14-07-40` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main miss was semantic rather than structural: the decline branch returned `terminalError("Deployment was not approved.")` in `src/deployment.ts`, while the deterministic check expected the final result to contain `decline`. The local verifier did not assert decline-result text; `src/verify.ts` only checked `assert.equal(declined.isError, true)` and that it was not another input request, so its success message—`Verified accepted approval with note and terminal declined approval.`—gave false confidence.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main miss was inconsistent terminal wording: an explicit declined action returned `Deployment was not approved.`, while `approve: false` returned `Deployment was declined.` (`src/server.ts`, branches `response.action !== "accept"` and `if (!approval.approve)`). The agent’s own verification exposed the problematic result—`"text":"Deployment was not approved."`—but it still concluded, `Declined input returns one terminal isError: true result`, without checking that both decline representations used consistent decline-specific text.
