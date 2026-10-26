# mcp-use SDK agentic eval — 2026-10-26

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-26T14-56-37` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m57s
- Median turns: 18
- Median tool calls: 33
- Median tokens in/out: 1661010 / 7857
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline message: `src/server.ts` returns `text: "Deployment was not approved."` for `response.action === "decline"`, while the grader expected the result to contain “decline.” The agent’s own test exposed that exact output—`"text":"Deployment was not approved."`—but its assertion checked only `prompts !== 1 || result.isError !== true`, so it verified terminal behavior without validating the required decline wording. By contrast, the `approve: false` branch used `text: "Deployment was declined."`, creating inconsistent decline messages in the same handler.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was decline wording: the grader reports `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The source explicitly returns `approvalError("Deployment was not approved.")` for `response.action === "decline" || response.action === "cancel"` (`src/server.ts`), even though the separate accepted response with `approve: false` returns `approvalError("Deployment was declined.")`; using “declined” consistently would have avoided this contract mismatch. The agent’s live check confirmed terminal behavior but did not test the expected wording: it observed `"text":"Deployment was not approved."` and concluded only that decline returned ``isError: true` with a complete (non-input-required) result`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was SDK/protocol discovery through installed declarations and implementation internals: the agent repeatedly ran searches such as `rg -n "inputRequired|inputResponse|acceptedContent|inputResponses"` and later inspected `node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`, rather than relying on a skill file or fetched docs URL. The package’s declarations did eventually provide the needed guidance, including `Responses are not validated against it — pass the same schema to acceptedContent()`.
