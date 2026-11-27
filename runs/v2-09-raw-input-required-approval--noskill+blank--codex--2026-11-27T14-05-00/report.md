# mcp-use SDK agentic eval — 2026-11-27

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-11-27T14-05-00` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 20
- Median tool calls: 31
- Median tokens in/out: 1305472 / 7368
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The decisive bug was in `src/server.ts`: the generic rejection branch checks `approval === undefined` before the explicit decline branch and returns `"Deployment approval was not accepted."`; because a decline has no accepted content, it never reaches `if (!approval.approve)` and `"Deployment was declined."` The live test exposed this exact mismatch—`"action":"decline"` returned `"Deployment approval was not accepted."`—but the agent still concluded, `"Declined approval returns one terminal isError: true result"`, overlooking the required decline wording.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The agent relied heavily on grepping installed SDK declarations rather than docs or a skill file, starting with `rg -n "inputRequired|inputResponse|acceptedContent|streamable|Streamable|inputResponses" node_modules/mcp-use` and then inspecting `node_modules/@modelcontextprotocol/server/dist`. This worked, but API discovery required several searches through bundled declaration files before implementation.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was decline wording: `src/server.ts` returns `"Deployment was not approved."` for a declined elicitation, while the deterministic check required the final result to contain `"decline"`; the separate `approve: false` branch did use `"Deployment was declined."`. The agent’s own decline test was too weak to catch this because it asserted only `!result.isError || prompts !== 1`, then accepted output containing `"Deployment was not approved."`.
