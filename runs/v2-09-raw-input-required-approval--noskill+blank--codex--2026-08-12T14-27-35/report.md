# mcp-use SDK agentic eval — 2026-08-12

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-12T14-27-35` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The key correctness miss was the cancellation/decline wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` for any non-accept elicitation, while only accepted `{ approve: false }` returns `terminalError("Deployment was declined.")`. The agent manually verified the former response as `Deployment approval was not granted.`, but did not notice that the expected decline path required decline-specific text; it nevertheless concluded, `Decline/cancel/false/malformed retries return terminal isError: true results`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `errorResult("Production deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`, while the other false-approval branch returns `"Production deployment was declined."`; the deterministic check specifically reported that `"Production deployment was not approved." did not match {"type":"contains","value":"decline"}`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main miss was the terminal decline wording: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check reports `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent’s live test confirmed only terminality, not grader-compatible semantics—the response was `"isError":true` with `"Deployment was not approved."`, followed by the conclusion that it “`returns a terminal isError result for a decline`”; this verification did not check that the message itself contained “decline.”
