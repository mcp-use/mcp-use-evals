# mcp-use SDK agentic eval — 2026-08-26

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-08-26T14-16-58` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 3m17s
- Median turns: 19
- Median tool calls: 38
- Median tokens in/out: 1758953 / 14833
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive miss was the decline wording: `src/server.ts` returns `terminalError("Deployment was not approved.")` for `response.action === "decline"`, while the grader required the final result to contain `decline`. The agent’s verification checked only terminal shape—`if(result.resultType!=="complete" || result.isError!==true || "inputRequests" in result) process.exit(1)`—so it printed `declined approval verified as one terminal error result` without asserting the error text. This also made the final claim `Declined approval returns one terminal \`isError: true\` result` too weak to catch the contract mismatch.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was decline wording: the grader expected text containing “decline,” but the non-accept branch returned `Deployment approval was not granted.` (`src/server.ts`, non-accept error branch), while only accepted content with `approve: false` returned `Deployment approval was declined.` (`src/server.ts`, `if (!approval?.approve)`). The agent’s own live decline verification exposed the problematic response—`"text":"Deployment approval was not granted."`—but it concluded only that it was terminal: `a declined retry returned a complete isError result with no new input request`, overlooking the wording requirement used by the caller check.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The agent spent substantial discovery time inspecting package internals rather than using a skill or fetched docs: it ran `rg -n "inputRequired|inputResponse|acceptedContent..." node_modules/mcp-use`, read `node_modules/mcp-use/README.md`, several `dist/*.d.ts` files, and eventually searched `node_modules/@modelcontextprotocol/server`. The first broad grep produced a largely minified result, while another search exited with code 2, indicating awkward API discoverability.
