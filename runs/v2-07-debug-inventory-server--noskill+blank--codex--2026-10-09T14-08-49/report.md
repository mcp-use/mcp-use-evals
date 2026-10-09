# mcp-use SDK agentic eval — 2026-10-09

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-09T14-08-49` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m18s
- Median turns: 12
- Median tool calls: 13
- Median tokens in/out: 413774 / 3533
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery friction was that the agent tried to inspect the SDK before dependencies existed: `rg: node_modules/mcp-use: IO error ... No such file or directory`. After `npm install`, it relied on grepping package internals and declarations—`node_modules/mcp-use/dist/server.d.ts`, `node-http.d.ts`, and `config.d.ts`—to confirm `listen()` behavior and the streamable HTTP API; no skill file or external docs URL appears in the transcript.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command took a minor wrong turn because `git status --short` failed in the non-git workspace with `fatal: not a git repository`, causing the chained command to exit before completing all intended discovery.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The agent briefly took a discovery detour by grepping the SDK before dependencies existed, receiving `node_modules/mcp-use: No such file or directory`; it then ran `npm install` and repeated the search successfully. It relied on installed declaration files rather than a skill or external docs, inspecting `node_modules/mcp-use/dist/server.d.ts` for `class MCPServer` and `listen(port?: number | undefined, options?: ListenOptions)` to confirm the transport API.
