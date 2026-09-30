# mcp-use SDK agentic eval — 2026-09-30

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-30T14-08-28` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m28s
- Median turns: 20
- Median tool calls: 33
- Median tokens in/out: 1034415 / 7216
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline-action message: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the false-approval branch separately returns `terminalError("Deployment was declined.")`. The grader specifically reports that `"Deployment was not approved." did not match {"type":"contains","value":"decline"}`, so using consistent “declined” wording would have avoided the failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The largest delay was environmental dependency installation: two attempts failed on `source-map-js-1.2.2.tgz` with `npm error 404 Not Found`, after which the agent worked around it by installing `npm install source-map-js@1.2.1 --save-exact`. This left an otherwise unrelated direct dependency visible in the final `npm ls` output as `source-map-js@1.2.1`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline-action wording: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` for `response.action === "decline" || response.action === "cancel"`, while only the separate `approve: false` branch says `"Deployment approval was declined."`. The agent’s own verification printed `{"text":"Deployment approval was not granted.","isError":true}`, but it concluded, `Declined retry returned one isError: true terminal result`, without checking that the message explicitly contained “decline.”
