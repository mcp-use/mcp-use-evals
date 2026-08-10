# mcp-use SDK agentic eval — 2026-08-10

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-10T14-27-27` · batch `31398047277-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m09s
- Median turns: 15
- Median tool calls: 26
- Median tokens in/out: 738221 / 6349
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had some SDK discovery friction and relied on installed package internals rather than a skill file or fetched docs URL: it searched `node_modules/mcp-use` with `rg -n "streamable|resource\(|tool\(|MCPServer"` and then inspected `node_modules/mcp-use/README.md`, `dist/config.d.ts`, `dist/resources.d.ts`, `dist/tools.d.ts`, and `dist/server.d.ts`. The initial `npm view mcp-use readme --json` attempt produced only package metadata—`"version": "2.1.0"` and `"description": "MCP framework and CLI built on the official v2 SDK"`—so the local README/type declarations supplied the actual API shape.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had to discover the SDK API directly from the installed package, querying `require('./node_modules/mcp-use/package.json').exports`, grepping `node_modules/mcp-use/README.md` for `resource|tool`, and opening declarations including `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`. This suggests the blank/no-skill run relied on package internals rather than a skill file or fetched docs URL.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent spent substantial discovery effort because the blank workspace offered no local guidance: it queried npm with `npm view mcp-use version description...`, fetched a README that produced no visible output (`"output":""`), then cloned the full upstream repository via `git clone --depth 1 https://github.com/mcp-use/mcp-use.git`. Repository layout assumptions caused an early dead end: `rg: /tmp/mcp-use-repo/packages: No such file or directory`. It ultimately leaned on upstream examples and docs, including `/tmp/mcp-use-repo/examples/typescript/basic/src/index.ts`, `/tmp/mcp-use-repo/docs/v2/typescript/server/resources.mdx`, and `/tmp/mcp-use-repo/libraries/typescript/packages/server/examples/resource-template-completion/src/index.ts`, to establish `server.listen()` and `resourceTemplate()` usage.
