# mcp-use SDK agentic eval — 2026-10-09

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-10-09T14-08-49` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m12s
- Median turns: 13
- Median tool calls: 20
- Median tokens in/out: 474985 / 5363
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): API discovery took some work because the npm README search returned no matches: `npm view mcp-use readme | rg ...` produced `""`. The agent then relied on installed declaration files, inspecting `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, `config.d.ts`, and `index.d.ts` to determine the `MCPServer`, `inputSchema`, and HTTP API shape; no skill file or fetched docs URL appears in the transcript.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description homepage repository.url --json`, then inspected the installed package via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and related declaration files. The useful listener behavior came from those typings, including `listen(port?: number | undefined...)` and the note that port precedence is “`the argument, PORT, config.port, then 3000`”; no skill file or external docs URL was used.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had some environment-discovery friction: its first inspection combined file listing with Git status and failed because `fatal: not a git repository`, preventing useful output from that command. With no skill file available, it relied on npm/package internals, first querying `npm view mcp-use version description repository.url dist-tags --json`, then searching `node_modules/mcp-use` for `"streamable|Streamable|MCPServer|create.*Server|tool\\("`, and finally reading `node_modules/mcp-use/README.md` plus declaration files such as `dist/server.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`.
