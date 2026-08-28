# mcp-use SDK agentic eval — 2026-08-28

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-28T18-02-29` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m02s
- Median turns: 14
- Median tool calls: 30
- Median tokens in/out: 1316330 / 7363
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The key contract miss was the decline wording: `src/server.ts` returns `deploymentError("Deployment was not approved.")`, and the manual retry confirmed `"text":"Deployment was not approved."`; it never included the expected word “decline.”
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent relied heavily on installed declarations rather than a skill file or fetched docs, first running `rg -n "inputRequired|inputResponse|acceptedContent|streamable" node_modules/mcp-use` and then inspecting `node_modules/mcp-use/dist/index.d.ts`, `context.d.ts`, and `README.md`. Discovery was somewhat awkward: its first targeted declaration search exited with `exitCode":1`, after which it had to inspect `@modelcontextprotocol/server` package files and eventually locate `declare const inputRequired`, `declare function acceptedContent`, and `declare function inputResponse`.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive contract miss was in `src/server.ts`: explicit decline responses enter `if (response.kind !== "elicit" || response.action !== "accept")` and return `terminalError("Deployment was not approved.")`, while only accepted responses with `approve: false` return `"Deployment was declined."`. The agent’s own retry test exposed this exact output—`"text":"Deployment was not approved."`—but it concluded that the decline was verified rather than checking for decline-specific wording.
