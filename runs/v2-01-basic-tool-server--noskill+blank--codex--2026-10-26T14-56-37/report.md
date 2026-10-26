# mcp-use SDK agentic eval — 2026-10-26

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-26T14-56-37` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m02s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 391763 / 3772
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): Discovery required several probes before implementation: the agent queried npm with `npm view mcp-use version description repository.url dist-tags --json`, inspected the tarball via `npm pack mcp-use --dry-run --json`, and first tried a stale repository path that returned `curl: (22) The requested URL returned error: 404`. It then fetched the root GitHub README, whose output pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that documentation URL being opened directly.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main wrong turn was a scaffold-editing error in `package.json`: it contained both `"type": "module"` and a later `"type": "commonjs"`, so Node treated the project as CommonJS (`node -p ...` returned `commonjs`). This caused the first verification to fail with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent inspected the file, corrected it, and the subsequent `npx tsc --noEmit` succeeded.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main wrong turn was a scaffold/config edit that left duplicate module declarations in `package.json`: the inspection showed both `"type": "module"` and later `"type": "commonjs"`. That caused the first typecheck to fail with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` Node globals were also not enabled despite `@types/node` having been installed, producing `TS2591: Cannot find name 'process'` and requiring a `tsconfig.json` correction before `npx tsc --noEmit` passed.
