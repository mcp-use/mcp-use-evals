# mcp-use SDK agentic eval — 2026-08-17

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-17T14-08-40` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m47s
- Median turns: 25
- Median tool calls: 40
- Median tokens in/out: 2069962 / 10255
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The agent relied heavily on installed declarations and implementation inspection rather than docs: it ran `rg -n "inputRequired|inputResponse|acceptedContent|Streamable|streamable" node_modules/mcp-use`, opened `node_modules/mcp-use/dist/server.d.ts`, and printed helper implementations with `console.log('inputRequired', inputRequired.toString())`. The README search produced nothing useful: `rg -n -C 4 "tools/list|initialize|curl|input_required|inputResponses" node_modules/mcp-use/README.md` returned an empty result.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline wording: the grader reports `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. In `src/server.ts`, explicit `approve: false` returns `"Deployment was declined."`, but protocol-level decline/cancellation first enters the broader branch and returns `"Deployment was not approved."` via `if (response.kind !== "elicit" || response.action !== "accept")`. The agent manually observed that exact response—`"text":"Deployment was not approved."`—yet concluded, `The endpoint now returns ... a single terminal error for a declined response`, so its verification checked terminality but not expected semantic wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` for an explicit decline/cancellation, while another branch returns `terminalError("Deployment was declined.")`. The grader exercised the former and required text containing `decline`. The verification failed to catch this because `scripts/verify-flow.ts` only asserts `assert.ok("isError" in declined && declined.isError)` and absence of another request; it never checks the error text, despite printing `Verified accepted approval with note and terminal declined approval.`
