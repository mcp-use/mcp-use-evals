# mcp-use SDK agentic eval — 2026-11-23

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-23T14-05-50` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 67% (2/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 2/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m00s
- Median turns: 17
- Median tool calls: 29
- Median tokens in/out: 1287979.5 / 7261
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main time sink was manual wire-protocol verification rather than server implementation. The agent needed five corrective retries before the initial tool call succeeded: missing `_meta` (`missing the required per-request envelope key(s): _meta`), missing envelope fields (`missing ... io.modelcontextprotocol/protocolVersion, io.modelcontextprotocol/clientCapabilities`), missing `Mcp-Method` (`the required Mcp-Method header is absent`), missing `Mcp-Name` (`the required Mcp-Name header is absent`), and undeclared elicitation support (`client capabilities do not declare the required capability`). This suggests the SDK’s 2026 request-envelope and header requirements were not readily discoverable for raw curl testing.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main time sink was discovering the pinned SDK’s API and wire protocol by spelunking installed packages rather than using a focused example: the agent ran `rg -n -C 4 "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use`, read `node_modules/mcp-use/README.md`, inspected `dist/*.d.ts`, and eventually opened the bundled implementation around `buildInputRequired`. The README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows no fetch of that URL.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was wording: the decline branch returned `deploymentError("Deployment was not approved.")` in `src/server.ts`, while the deterministic check required text containing `decline`; the reported failure was `final result "Deployment was not approved." did not match {"type":"contains","value":"decline"}`. The agent’s own live check only verified terminal shape, saw `"text":"Deployment was not approved."`, and then concluded, `The live MCP checks passed`, so its verification did not mirror the grader’s expected decline wording.
