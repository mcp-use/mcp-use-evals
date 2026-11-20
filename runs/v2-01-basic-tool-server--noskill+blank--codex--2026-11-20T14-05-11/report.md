# mcp-use SDK agentic eval — 2026-11-20

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-20T14-05-11` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m17s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 468689 / 3482
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent needed API discovery before implementation: it queried npm with `npm view mcp-use readme --json`, then searched installed SDK files using `rg -n "class MCPServer|serve\(|listen\(|streamable|http" node_modules/mcp-use/dist node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts`. The README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript shows local declaration inspection rather than fetching that URL.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent relied on package-local documentation and type declarations rather than a skill file or fetched docs: it inspected `node_modules/mcp-use/README.md`, searched `node_modules/mcp-use/dist/*.d.ts` for `"listen\\(|serve\\(|streamable|http"`, and opened `server.d.ts` plus `config.d.ts`. The README exposed the external docs URL, `"https://docs.mcp-use.com/v2/typescript/getting-started/welcome"`, but the transcript does not show it being fetched.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main papercut came from the npm scaffold: `npm init -y` created `"type": "commonjs"`, and the agent’s first package edit accidentally left both `"type": "module"` and a later `"type": "commonjs"`. That caused the only typecheck failure: `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` Removing the duplicate fixed it, after which `npx tsc --noEmit` exited successfully.
