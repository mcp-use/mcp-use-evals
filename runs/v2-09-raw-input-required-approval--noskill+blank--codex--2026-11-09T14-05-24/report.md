# mcp-use SDK agentic eval — 2026-11-09

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-09T14-05-24` · batch `42631012911-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The correctness miss was narrowly in the explicit-decline branch: `src/server.ts` returns `"Deployment approval was not granted."` when `response.action !== "accept"`, while the separate `approve: false` branch returns `"Deployment approval was declined."`; the grader expected the explicit decline result to contain `decline`. The agent’s own verification exposed the problematic response — `"text":"Deployment approval was not granted."` — but it concluded, `"Verified a decline returns one terminal isError: true result"`, checking terminality rather than wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was the terminal decline text: `src/server.ts` returns `"Deployment was not approved."`, while the deterministic check required text containing `decline`. The agent verified only shape/terminality—its conclusion was “`Declined approval returns one terminal isError: true complete result`”—but did not validate the expected wording, despite the observed response being `"text":"Deployment was not approved."`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The main correctness miss was terminal-decline wording: `src/server.ts` returns `text: "Deployment was not approved."`, while the deterministic check reports `did not match {"type":"contains","value":"decline"}`. The agent’s own verification only asserted terminal error behavior—`if (!declined.isError) throw ...`—and therefore did not catch the required grader-visible wording despite concluding, `Declined approval returns one terminal isError: true result`.
