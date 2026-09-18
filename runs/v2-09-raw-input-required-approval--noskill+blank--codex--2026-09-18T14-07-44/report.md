# mcp-use SDK agentic eval — 2026-09-18

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-18T14-07-44` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was inconsistent terminal wording: `src/server.ts` returns `"Deployment approval was not accepted."` for `response.action !== "accept"`, while only accepted content with `approve: false` returns `"Deployment was declined."`. The agent’s own direct-decline verification exposed this exact response — `"text":"Deployment approval was not accepted."` — but it still concluded that “a declined response returns a complete terminal error result,” overlooking the wording distinction that later failed the call check.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The substantive miss was the decline error wording: `src/server.ts` returns `"Production deployment approval was not granted."`, while the deterministic check expected text containing `decline`. The agent’s own verification displayed that exact response — `"text":"Production deployment approval was not granted."` — but it still concluded, `"Declined retry returns one terminal isError: true result"`, without checking the expected decline wording. A nearby branch already used the safer phrase `"Production deployment approval was declined or invalid."`, but explicit `action: "decline"` took the earlier generic branch.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was inconsistent terminal wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for protocol-level decline/cancel, while only accepted `{ approve: false }` returns `terminalError("Deployment was declined.")`. The verification did not assert decline text—`src/server.test.ts` checks only `assert.equal(declined.isError, true)` and `assert.equal("inputRequests" in declined, false)`—so it reported `Verified accepted approval with note and terminal declined approval.` without catching the grader’s required “decline” substring.
