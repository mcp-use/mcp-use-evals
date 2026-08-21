# mcp-use SDK agentic eval — 2026-08-21

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-21T14-13-35` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent spent substantial time reverse-engineering protocol details from installed packages rather than using higher-level client tooling, relying on `rg`/`sed` across `node_modules/mcp-use` and `node_modules/@modelcontextprotocol/server`, e.g. `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable|listen" node_modules/mcp-use` and later inspecting `src-CX2iR2pK.mjs`. No skill file or fetched docs URL appears; the resources used were package declarations, bundled source, and `node_modules/mcp-use/README.md`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main miss was inconsistent decline wording. In `src/server.ts`, an explicit response action uses `return terminalError("Deployment was not approved.");`, while an accepted form with `approve: false` uses `return terminalError("Deployment was declined.");`. The live decline verification only exercised the former and printed `"text":"Deployment was not approved."`; the agent then concluded, `Verified decline prompts once, then returns a terminal isError result`, without checking that the response text contained “decline,” which caused the reported contract-call failure.
