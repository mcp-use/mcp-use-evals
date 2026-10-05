# mcp-use SDK agentic eval — 2026-10-05

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-05T14-10-34` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main correctness miss was the explicit decline-action message: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`, while only an accepted response with `approve: false` returns `terminalError("Deployment was declined.")`. This distinction caused the deterministic failure because the decline result did not contain `decline`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline message: `src/server.ts` returns `terminalError("Deployment approval was not granted.")`, while another branch uses the more explicit `"Deployment approval was declined or invalid."`; the grader expected the decline result to contain `decline`. The agent’s verification only asserted terminal shape—`HTTP verification passed: input_required, accepted approval, and terminal decline.`—so it did not catch the wording mismatch.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the declined-result wording: the implementation returned `text: "Deployment was not approved."` (`src/server.ts`), while the deterministic check required text containing `decline`. The agent’s own verification exposed exactly this output — `\"text\":\"Deployment was not approved.\"` — but it still concluded, `Declined deployment issued one form request, then returned one terminal error`, without checking the expected decline wording.
