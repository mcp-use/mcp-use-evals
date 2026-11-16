# mcp-use SDK agentic eval — 2026-11-16

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-16T14-16-16` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m32s
- Median turns: 16
- Median tool calls: 33
- Median tokens in/out: 2124897 / 7929
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the explicit decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while only accepted `{ approve: false }` returns `terminalError("Deployment was declined.")`. The agent’s own verification exposed both different messages—`ERROR Deployment was not approved.` and `ERROR Deployment was declined.`—but it concluded broadly that “`Declined approval returns one terminal isError result`” without noticing the grader expected decline-identifying text.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The main miss was terminal decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")`, while the deterministic check required the result to contain `decline`. The agent’s own verification only checked terminal shape, reporting that the response was a terminal ``isError` completion without `input_required``, so it did not test the expected semantic wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The agent relied heavily on installed package internals rather than external docs, first searching `node_modules/mcp-use` with `rg -n "inputRequired|inputResponse|acceptedContent|streamable|HTTP|http"` and then inspecting declarations under `node_modules/@modelcontextprotocol/server/dist`. This was productive for discovering helper and `listen` API shapes, but contributed to a relatively long exploration.
