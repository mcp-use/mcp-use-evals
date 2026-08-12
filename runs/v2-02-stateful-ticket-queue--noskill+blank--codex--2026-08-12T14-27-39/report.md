# mcp-use SDK agentic eval — 2026-08-12

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-12T14-27-39` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m33s
- Median turns: 15
- Median tool calls: 22
- Median tokens in/out: 628696 / 6511
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main time sink was API discovery: the agent first queried npm with `npm view mcp-use readme`, then searched the installed package using `rg -n "streamable|Streamable|createMcp|MCPServer|tool\(" node_modules/mcp-use/...`, and finally inspected several declaration-file ranges such as `sed -n '120,250p' node_modules/mcp-use/dist/server.d.ts`. It leaned on the package’s local README quickstart—`## Quickstart` and `import { MCPServer } from "mcp-use";`—rather than a skill file or fetched docs URL.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main overhead was API discovery: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json`, fetched the repository README via `curl ... raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`, and then fetched `https://mcp-use.com/prompt.md`. It ultimately relied on installed declarations, running `rg -n "listen\\(|serve\\(|Streamable|streamable|MCPServer" node_modules/mcp-use` and inspecting `node_modules/mcp-use/dist/server.d.ts`; that declaration supplied the decisive signature, `listen(port?: number | undefined, options?: ListenOptions)`, and documented the `/mcp` behavior. The fetched prompt was not directly tailored to this task—it instructed, `Build and deploy an MCP app to Manufact Cloud for me` and `Install the mcp-use skill`—so node_modules inspection was the more useful resource visible in the run.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent spent substantial discovery effort before implementation: it queried npm with `npm view mcp-use version description repository.url --json`, inspected package contents via `npm pack mcp-use@2.1.1 --dry-run`, fetched the repository README with `curl -fsSL https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`, and fetched `https://mcp-use.com/prompt.md`. The dry-run packaging approach was a dead end because the next command failed with `tar: mcp-use-2.1.1.tgz: Cannot open: No such file or directory`; `--dry-run` had not created the archive.
