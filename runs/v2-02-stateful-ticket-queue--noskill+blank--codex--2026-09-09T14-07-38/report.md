# mcp-use SDK agentic eval — 2026-09-09

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-09T14-07-38` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m21s
- Median turns: 16
- Median tool calls: 26.5
- Median tokens in/out: 720265 / 6754.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main friction was API discovery. `npm view mcp-use readme --json` returned no README content, so the agent inspected the installed package directly with `find node_modules/mcp-use` and `sed -n '1,220p' node_modules/mcp-use/README.md`. It then relied on declaration files to determine the server API, including `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`, after an exploratory command failed because expected entry points were absent: `sed: can't read node_modules/mcp-use/dist/node-http.d.ts` was reflected by `exitCode:2`. No mcp-use skill file or fetched docs URL appears in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent relied heavily on package inspection rather than a skill or external docs: it queried npm with `npm view mcp-use version description repository.url --json`, opened `node_modules/mcp-use/README.md`, and inspected SDK declarations via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` plus `rg -n "listen\\(|streamable|mount"`. This worked, but indicates API-discovery friction in the blank-workspace variant.
