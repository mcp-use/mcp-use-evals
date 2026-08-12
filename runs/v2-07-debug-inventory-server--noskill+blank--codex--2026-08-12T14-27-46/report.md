# mcp-use SDK agentic eval — 2026-08-12

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-08-12T14-27-46` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m15s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 529871 / 4729
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

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first inspection command bundled repository discovery with `git status`, so it exited unsuccessfully in the non-git workspace: `fatal: not a git repository (or any of the parent directories): .git`. This was minor because the file listing still revealed `tsconfig.json`, `package.json`, and `src/server.ts`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main discovery friction was that the agent tried inspecting SDK internals before dependencies existed: `rg: node_modules/mcp-use: IO error for operation on node_modules/mcp-use: No such file or directory`. It then ran `npm install` and leaned heavily on grepping installed declarations—`rg -n "class MCPServer|listen\(|streamable|Streamable|http" node_modules/mcp-use`—including `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/config.d.ts`, rather than using a skill file or fetched docs visible in the transcript. The declarations did answer the transport/default-port question with `TCP port listen() binds when neither an explicit port nor PORT is set` and `@defaultValue 3000`.
