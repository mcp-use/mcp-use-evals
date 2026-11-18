# mcp-use SDK agentic eval — 2026-11-18

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-18T14-04-58` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m26s
- Median turns: 27
- Median tool calls: 36
- Median tokens in/out: 2081987 / 8102
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the explicit decline/cancellation branch in `src/server.ts`: `if (response.kind !== "elicit" || response.action !== "accept")` returns `"Deployment approval was not granted."`, while only accepted content with `approve: false` returns `"Deployment was declined."`. The agent’s own declined HTTP check showed `"text\":\"Deployment approval was not granted.\""`, but it concluded that the exchange “succeeded” without checking that the terminal message identified the decline; this directly aligns with the reported contract failure.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent spent substantial discovery time grepping installed packages for helper and server API shape, starting with `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use` and later inspecting `node_modules/@modelcontextprotocol/server/dist/src-CX2iR2pK.mjs`; several searches were dead ends, including `rg: node_modules/mcp-use/node_modules/@modelcontextprotocol/server: No such file or directory` and empty `inputRequired` searches. It relied on package declarations and bundled implementation rather than a skill file or fetched docs, explicitly reading `node_modules/mcp-use/dist/response-helpers.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was the decline error wording: `src/server.ts` returns `"Deployment was not approved."`, while the deterministic check required the final result to contain `decline`. The agent explicitly verified that same response—`"text":"Deployment was not approved."`—and then concluded, `Declined approval returns one terminal isError: true result`, so its verification checked terminality but not the expected decline-specific text.
