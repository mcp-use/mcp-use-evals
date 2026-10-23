# mcp-use SDK agentic eval — 2026-10-23

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-10-23T14-08-09` · batch `39966811632-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m48s
- Median turns: 20
- Median tool calls: 37
- Median tokens in/out: 1473161 / 8115
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was inconsistent terminal wording: the explicit decline/cancel branch returns `text: "Deployment was not approved."` in `src/server.ts`, while accepted `{ approve: false }` returns `text: "Deployment was declined."`. The agent verified both outputs—`ERROR Deployment was not approved.` and `ERROR Deployment was declined.`—but concluded only that “`Decline returns one isError: true terminal result`,” overlooking the grader’s expected decline wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The implementation itself was direct, but API discovery depended heavily on installed-package internals: the agent searched `node_modules/mcp-use/dist/index.d.ts`, `node_modules/mcp-use/README.md`, and then the underlying server declarations with `rg -n "inputRequired|inputResponse|acceptedContent"`. The most useful discovered example came from `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`, which showed `acceptedContent(...ctx.mcpReq.inputResponses...)` and `inputRequired.elicit(...)`; no skill file or fetched docs URL appears in the transcript.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main correctness miss was the decline error wording. The produced source returns `text: "Deployment was not approved; no deployment was performed."` (`src/server.ts`), while the deterministic check required the final result to contain `decline`; this explains the reported failure despite the response being terminal.
