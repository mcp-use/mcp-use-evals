# mcp-use SDK agentic eval — 2026-09-23

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-23T14-07-57` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the explicit-decline error wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"`, while the grader expected the decline result to contain `decline`. The agent’s own verification showed the problematic text—`"text":"Deployment was not approved."`—but it only checked that this was terminal, concluding `Declined approval returned a single terminal error result`, so the semantic wording mismatch went unnoticed. By contrast, accepted `approve: false` used the clearer `terminalError("Deployment was declined.")`, making the inconsistency easy to avoid.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was inconsistent decline wording: explicit `response.action === "decline"` returned `terminalError("Deployment was not approved.")` (`src/server.ts`), while accepted `{ approve: false }` returned `terminalError("Deployment was declined.")`. The agent’s verifier accepted the former—`accepted approval and terminal decline verified`—but the deterministic check expected the decline result to contain `decline`, so the self-test did not enforce the grader-visible message requirement.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main miss was the decline error wording: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check required a result containing `decline`. The local test did not assert the error text; `tests/deployment-flow.test.ts` only checks `assert.equal(declined.isError, true)` and absence of `"resultType"`/`"inputRequests"`. This allowed the agent to conclude `Accepted approval and terminal decline verified.` without catching the contract mismatch.
