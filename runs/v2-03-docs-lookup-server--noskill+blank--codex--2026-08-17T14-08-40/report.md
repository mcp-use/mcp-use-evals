# mcp-use SDK agentic eval — 2026-08-17

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-17T14-08-40` · batch `32037896087-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 13.5
- Median tool calls: 25
- Median tokens in/out: 650413 / 5605
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

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had discovery friction on the SDK API and leaned heavily on package metadata and installed declarations: it fetched the npm README via `npm view mcp-use readme --json`, then searched `node_modules` with `rg -n "resource\\(|resources|streamable|listen\\(|serve\\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/resources.d.ts` plus `server.d.ts`. No mcp-use skill file or docs-page fetch appears; the only visible documentation lead was the README link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK API from package artifacts rather than an available skill: the agent queried npm with `npm view mcp-use readme` and then searched installed declarations using `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,230p' node_modules/mcp-use/dist/resources.d.ts`. This worked, but required several exploratory calls to establish `resource`, `resourceTemplate`, and `listen` shapes.
