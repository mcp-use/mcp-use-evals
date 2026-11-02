# mcp-use SDK agentic eval — 2026-11-02

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-02T14-06-29` · batch `41458526401-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m29s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 370186 / 5198
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent relied on installed-package inspection rather than a skill file or fetched docs: it read `node_modules/mcp-use/README.md`, then probed `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts` while grepping for `"listen|streamable|serve"`. That discovery was slightly awkward because one inspection command exited with code 2 (`[result] {"exitCode":2,...}`), after which the agent narrowed the search to `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The agent relied heavily on package-local discovery rather than a skill file: it inspected `node_modules/mcp-use/README.md`, searched declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts`, and read `node_modules/mcp-use/dist/config.d.ts` plus `index.d.ts`. The first declaration lookup included nonexistent paths and exited 2: `sed: can't read ...` is not shown because output was truncated, but the command result explicitly reports `"exitCode":2`; this added avoidable discovery friction. The README did surface the official docs URL, `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but there is no evidence the agent fetched it.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url` and `npm view mcp-use readme --json`, then inspected the installed package via `sed -n '1,240p' node_modules/mcp-use/README.md` and searched declarations with `rg -n "listen\\(|streamable|HTTP|node" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts`. It ultimately relied on package internals including `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `config.d.ts` to establish that “`The SDK provides a built-in streamable HTTP listener at /mcp`”; no external docs URL appears in the transcript.
