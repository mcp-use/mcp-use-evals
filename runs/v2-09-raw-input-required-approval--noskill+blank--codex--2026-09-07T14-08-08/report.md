# mcp-use SDK agentic eval — 2026-09-07

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-07T14-08-08` · batch `34131110794-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 0/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 3

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The main correctness miss was decline wording: `src/server.ts` returns `"Deployment approval was not granted."` for both non-accept responses and `approve !== true`, so it never emits the grader-expected text containing `decline`. The agent’s own decline verification confirmed that generic message: `"text":"Deployment approval was not granted."`, but it concluded, `"Declined and approve: false retries return one isError: true complete result"`, without checking message content.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The key miss was decline-result wording: `src/server.ts` returns `"Deployment was not approved."` for `response.action !== "accept"`, while the reported failure says it `did not match {"type":"contains","value":"decline"}`. The agent’s own declined-path verification showed the same text—`"Deployment was not approved."`—but it concluded, `Declined approval returns one terminal isError: true result`, checking terminality without checking the expected decline wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was cancellation wording: `src/server.ts` returns `"Deployment approval was not granted."` for non-accept responses, while the grader expected the terminal result to contain `decline`. The dedicated decline branch used `"Deployment approval was declined."`, but cancellation bypassed it via `return { ... text: "Deployment approval was not granted." }`.
