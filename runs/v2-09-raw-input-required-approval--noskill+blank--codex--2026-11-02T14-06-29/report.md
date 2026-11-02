# mcp-use SDK agentic eval — 2026-11-02

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-02T14-06-29` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The agent leaned heavily on installed declarations and implementation searches rather than docs, first running `rg -n "inputRequired|inputResponse|acceptedContent..." node_modules/mcp-use` and later inspecting `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. This discovery was somewhat costly: the first implementation used `ctx.mcpReq`, then typechecking failed with `Property 'mcpReq' does not exist`, prompting another search for `mcpReq|inputResponses` before switching to `ctx.inputResponses`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive contract miss was the decline-action error wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while the deterministic check reports `did not match {"type":"contains","value":"decline"}`. The agent’s own verification only asserted shape—`assert.equal(declined.isError, true)` and `assert.equal("inputRequests" in declined, false)` in `src/verify.ts`—so it never checked the error text and concluded `Verified accepted approval with note and terminal declined approval.` Notably, the separate `approve: false` path did use `terminalError("Deployment was declined.")`, making the inconsistent wording easy to miss.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `"Deployment approval was not granted."` for a declined elicitation, while the deterministic check required text containing `decline`. The agent’s own verification only asserted terminal shape, not semantic wording: it reported `tools/call request_deploy ERROR Deployment approval was not granted.` and concluded, “`Declined approval returns one terminal error result`,” so the contract mismatch escaped its test. A nearby branch did use `"Deployment approval was declined or invalid."`, but only for accepted responses with `approve: false` (`src/server.ts`), creating inconsistent decline messages across equivalent terminal outcomes.
