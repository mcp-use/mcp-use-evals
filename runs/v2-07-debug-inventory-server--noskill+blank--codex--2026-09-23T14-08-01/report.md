# mcp-use SDK agentic eval — 2026-09-23

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-09-23T14-08-01` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 12
- Median tool calls: 14
- Median tokens in/out: 383141 / 4089
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main discovery detour was checking SDK internals before dependencies existed: `rg ... node_modules/mcp-use` returned `No such file or directory`, after which the agent ran `npm install` and repeated the search. It then relied heavily on installed declarations rather than a skill file or fetched docs, inspecting `node_modules/mcp-use/dist/server.d.ts`; the decisive API text was `Port precedence is the argument, PORT, config.port, then 3000`. That lookup led to the final configuration at `src/server.ts:9-14`, including `port: 3000`, while retaining `await server.listen();`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The run was successful but included some avoidable discovery and verification churn. The initial inspection command bundled repository checks and failed because the scaffold was not a Git repository: `fatal: not a git repository (or any of the parent directories): .git`.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The first inspection command bundled `git status --short` with file reads, so the non-repository error—`fatal: not a git repository`—aborted before showing the source and required a second inspection command. This was minor avoidable friction.
