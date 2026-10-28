# mcp-use SDK agentic eval — 2026-10-28

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-28T14-06-34` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 16
- Median tool calls: 34
- Median tokens in/out: 1725131 / 7282
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline error wording: `src/server.ts` returns `errorResult("Production deployment was not approved.")`, while the deterministic check required the final result to contain “decline.” The focused test did not assert message content; `src/server.test.ts` only checks `assert.equal(declined.isError, true)` and `assert.equal("resultType" in declined, false)`, allowing the contract mismatch through. The agent then interpreted that test as sufficient, stating, `Declined approval returns one terminal isError: true complete result—no new input request.`
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the explicit decline-action wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while only accepted content with `approve: false` returns `terminalError("Deployment was declined.")`. The agent’s verification checked terminal shape but apparently not decline-specific text, then concluded that `"a decline returns a single terminal error result"`; the live response confirmed `"text":"Deployment was not approved."`. A test asserting the expected decline wording would have caught the failed call contract.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The agent relied heavily on grepping installed declarations rather than a skill file or fetched documentation, first running `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use` and then inspecting `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. This was productive but consumed several discovery calls to establish helper signatures, context shape, and modern protocol metadata.
