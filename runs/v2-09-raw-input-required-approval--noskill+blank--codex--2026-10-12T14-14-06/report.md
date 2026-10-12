# mcp-use SDK agentic eval — 2026-10-12

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-12T14-14-06` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main correctness miss was cancellation/decline wording: `src/server.ts` returns `approvalError("Deployment approval was not granted.")` for any non-accept elicitation action, while only accepted `approve: false` returns `"Deployment was declined."`. The local decline test did not check the error text, asserting only `assert.equal(declined.isError, true)` and absence of `resultType`/`inputRequests`, so it reported `"Approval flow verified"` despite missing the grader’s expected decline marker.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline message: `src/server.ts` returns `text: "Deployment was not approved."` for `response.action === "decline" || response.action === "cancel"`, while the deterministic check required text containing `decline`. The agent’s own verification confirmed that exact response—`"text":"Deployment was not approved."`—but then concluded, `Declined approval returns one terminal isError: true result`, checking terminality without checking the likely wording expectation. The separate `approve: false` branch did use `"Deployment approval was declined."`, so using the same wording for explicit decline would have avoided the mismatch (`src/server.ts`, `approval?.approve === false ? "Deployment approval was declined."`).
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check reports that this `did not match {"type":"contains","value":"decline"}`. The agent’s direct verifier only asserted `!declined.isError` and therefore missed the externally expected error text; `src/verify.ts` checks `if (isInputRequiredResult(declined) || !declined.isError)` but never inspects `declined.content`.
