# mcp-use SDK agentic eval — 2026-10-09

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-09T14-08-48` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline error wording: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic retry check required the final result to contain `decline`. The agent’s verification did not assert error content; `scripts/verify-flow.ts` only checks `assert.equal(declined.isError, true)` and absence of `"resultType"`/`"inputRequests"`, so its message `Verified accepted approval with note and terminal declined approval.` overstated coverage of the externally observed result.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `text: "Deployment approval was not granted."` for an explicit decline, while the deterministic check required a result containing `decline`. The agent repeatedly treated only terminality as the assertion, checking `!declined.isError || "resultType" in declined`, and then concluded, `a declined retry returns one isError result with no input request`; that verification never asserted the decline message itself.
