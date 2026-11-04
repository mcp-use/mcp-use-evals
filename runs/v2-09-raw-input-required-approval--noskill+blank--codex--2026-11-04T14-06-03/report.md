# mcp-use SDK agentic eval — 2026-11-04

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-04T14-06-03` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m06s
- Median turns: 22
- Median tool calls: 35
- Median tokens in/out: 1811486 / 8035
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check required the final result to contain `"decline"`. The agent’s own verification only asserted `result.isError` and `requests !== 1`, so it accepted `Deployment was not approved.` without checking the contract-sensitive text.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the decline/cancellation wording: `src/server.ts` returns `"Deployment approval was not granted."` whenever `response.kind !== "elicit" || response.action !== "accept"`, while only accepted `approve: false` returns `"Deployment was declined."`. The verification did not catch this because it asserted only terminality—`declined.isError` and absence of another input request—before printing `verified accepted approval with note and terminal declined approval`; it did not assert that the decline result text contained “decline.”
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main time sink was API and protocol-shape discovery through installed packages rather than task-specific documentation. The agent repeatedly searched declarations and bundles with commands such as `rg -n -C 8 "inputRequired|inputResponse|acceptedContent" node_modules/mcp-use/dist --glob '*.d.ts'` and later inspected `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. A docs-directory attempt found no packaged docs: `rg: node_modules/mcp-use/docs: No such file or directory (os error 2)`.
