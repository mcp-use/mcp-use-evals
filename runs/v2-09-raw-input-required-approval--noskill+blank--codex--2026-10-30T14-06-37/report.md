# mcp-use SDK agentic eval — 2026-10-30

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-30T14-06-37` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m41s
- Median turns: 22
- Median tool calls: 29
- Median tokens in/out: 1183264 / 6855
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The substantive miss was the decline wording: `src/server.ts` returns `"Deployment was not approved."`, while the deterministic check reports that this “did not match `{"type":"contains","value":"decline"}`.” The agent manually verified only terminal-error behavior—its response was `"isError":true` with `"Deployment was not approved."`—and then concluded, `"Declined approval returns one terminal isError: true complete result"`, without checking that the text explicitly contained “decline.”
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The contract miss was a wording mismatch on the generic decline/cancel branch: `src/server.ts` returns `deploymentError("Deployment was not approved.")`, while only accepted `approve: false` returns `deploymentError("Deployment was declined.")`; the deterministic check specifically reported that `"Deployment was not approved." did not match ... "decline"`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main SDK friction was schema-version compatibility. The first typecheck rejected every Zod schema because `Property 'jsonSchema' is missing`, requiring a package change and reinstall before `npx tsc --noEmit` passed; the final dependency was `zod@4.6.7`. The error identifies the requirement but does not directly explain that a Zod upgrade is needed.
