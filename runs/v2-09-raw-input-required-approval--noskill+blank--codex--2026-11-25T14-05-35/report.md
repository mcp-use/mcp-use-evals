# mcp-use SDK agentic eval — 2026-11-25

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-25T14-05-35` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m05s
- Median turns: 18
- Median tool calls: 36
- Median tokens in/out: 1790974 / 8410
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the explicit decline message: `src/server.ts` returns `deploymentError("Deployment was not approved.")` for `response.action === "decline"`, while the separate `approve: false` branch returns `"Deployment was declined."`; the grader specifically reported that `"Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent’s own verification confirmed the problematic text—`ERROR Deployment was not approved.`—but concluded, `Wire verification passed`, so it checked terminal behavior without checking the decline wording expected by the harness.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent relied heavily on installed package internals rather than a skill or external docs, repeatedly grepping declarations and bundled code with commands such as `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable" node_modules/mcp-use` and `rg -n "inputRequired|acceptedContent|inputResponse" node_modules/@modelcontextprotocol/server/dist`. The local README search was not useful: `rg: README.md: No such file or directory`, and the only surfaced documentation pointer was the dependency README’s migration URL, `https://ts.sdk.modelcontextprotocol.io/v2/migration/`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive mistake was in cancellation/decline handling: `src/server.ts` returns `terminalError("Deployment approval was not granted.")` whenever `response.action !== "accept"`, while only accepted content with `approve: false` returns `"Deployment approval was declined."`. The agent’s own decline verification showed `"text":"Deployment approval was not granted."`, but it still concluded, `Both retry checks passed`, missing the wording mismatch that caused the deterministic failure.
