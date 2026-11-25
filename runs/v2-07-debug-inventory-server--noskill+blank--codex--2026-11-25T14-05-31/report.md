# mcp-use SDK agentic eval — 2026-11-25

Run `v2-07-debug-inventory-server--noskill+blank--codex--2026-11-25T14-05-31` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-07-debug-inventory-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m05s
- Median turns: 11
- Median tool calls: 13
- Median tokens in/out: 325073 / 3632
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-07-debug-inventory-server` · `noskill+blank` · trial 1 — [trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t1/memo.md): The main wrong turn was assuming startup needed repair: the agent said startup “`does not explicitly honor PORT`,” then inspected `node_modules/mcp-use/dist/server.d.ts`, whose example showed “`await server.listen(3000)`,” and ultimately kept `await server.listen();` in `src/server.ts`. This suggests the SDK’s implicit `PORT` behavior was not obvious from the scaffold or typings.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 2 — [trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t2/memo.md): The first reconnaissance bundled repository inspection with Git status, so the command failed because the scaffold was not a Git repository: `fatal: not a git repository (or any of the parent directories): .git`. A second bundled inspection also exited unsuccessfully and surfaced only an empty dependency tree, `debug-inventory-server@ . └── (empty)`, requiring `npm install` before SDK investigation.
- `v2-07-debug-inventory-server` · `noskill+blank` · trial 3 — [trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md](trials/v2-07-debug-inventory-server--noskill+blank--t3/memo.md): The main friction was environmental: the first dependency check reported `UNMET DEPENDENCY mcp-use@2.0.4`, `UNMET DEPENDENCY tsx@^4.0.0`, and other missing packages, so the agent spent 13 seconds on `npm install`; that also surfaced `5 high severity vulnerabilities` and an `esbuild@0.28.2` install-script warning unrelated to the repair.
