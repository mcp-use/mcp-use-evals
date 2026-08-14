# mcp-use SDK agentic eval — 2026-08-14

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-14T14-23-52` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline wording: the explicit decline path returned `text: "Deployment was not approved."` in `src/server.ts`, while the deterministic check expected text containing `decline`. The agent’s own live test showed `"text":"Deployment was not approved."`, but it concluded only that the response was terminal: `a declined retry returned a single terminal isError result with no new input request.` A nearby branch already used `"Deployment was declined or the approval response was invalid."` (`src/server.ts`), so routing `action: "decline"` through the generic non-accept branch created the mismatch.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was not SDK mechanics but decline wording: `src/server.ts` returns `"Deployment approval was not accepted."` for `response.action !== "accept"`, while the separate false-approval branch returns `"Deployment was declined."`. The agent’s own live decline verification exposed this exact output—`"text":"Deployment approval was not accepted."`—but it still concluded, `Declined response returned one isError: true terminal result`, without checking that the response text identified a decline. Routing `action: "decline"` through the generic non-accept branch caused the deterministic failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline message: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check required the final result to contain `decline`. The agent’s verification only asserted terminal shape—`declined.isError !== true || declined.resultType === 'input_required'`—so it never checked the decline text and reported success despite the contract failure.
