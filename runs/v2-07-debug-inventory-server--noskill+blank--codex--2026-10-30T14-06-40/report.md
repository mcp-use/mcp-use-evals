# mcp-use SDK agentic eval — 2026-10-30

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-10-30T14-06-40` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m16s
- Median turns: 10
- Median tool calls: 14
- Median tokens in/out: 383706 / 4396
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The first discovery command unnecessarily failed because it included `git status --short` in a non-repository, producing `fatal: not a git repository (or any of the parent directories): .git`; because the commands were chained with `&&`, the subsequent `find . -name AGENTS.md -print` did not run.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The agent lost a turn by assuming an object-shaped listen API; typechecking reported `Argument of type '{ port: number; }' is not assignable to parameter of type 'number'`, after which it changed the call and noted that ``listen` takes the port directly`. It consulted installed SDK internals rather than a skill file or docs URL, running `rg -n "listen\\(|streamable|/mcp|Streamable" node_modules/mcp-use`, though the visible result was a large minified bundle rather than a concise declaration.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main setup papercut was running the typecheck before dependencies were installed: `npx tsc --noEmit` fetched the unrelated `tsc@2.0.4` package and failed with `This is not the tsc command you are looking for`; the agent then recovered with `npm install`.
