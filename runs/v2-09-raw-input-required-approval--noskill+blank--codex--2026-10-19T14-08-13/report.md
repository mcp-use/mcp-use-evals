# mcp-use SDK agentic eval — 2026-10-19

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-19T14-08-13` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline-action branch’s wording: `src/server.ts` returns `"Deployment approval was not accepted."` when `response.action !== "accept"`, while only accepted `approve: false` reaches `"Deployment was declined."` This explains the reported contract-call mismatch, and the agent’s own verification exposed the problematic output as `"declined":{"isError":true,"content":[{"type":"text","text":"Deployment approval was not accepted."}]}` without checking that it mentioned decline. Its assertion only tested terminal shape—`if (declined.isError !== true || 'inputRequests' in declined)`—so the semantic mismatch passed locally.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent spent substantial time reverse-engineering APIs and wire behavior from installed packages, using `find node_modules/mcp-use`, `rg -n "inputRequired|inputResponse|acceptedContent"`, and source inspection such as `sed -n '5500,5635p' node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`; no skill file or fetched docs URL appears in the transcript.
