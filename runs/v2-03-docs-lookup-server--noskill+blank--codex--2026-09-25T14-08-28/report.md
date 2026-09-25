# mcp-use SDK agentic eval — 2026-09-25

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-25T14-08-28` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m49s
- Median turns: 13
- Median tool calls: 20
- Median tokens in/out: 564901 / 4896
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main wrong turn was a package configuration edit that left duplicate module declarations: `package.json` showed both `"type": "module"` and `"type": "commonjs"`. This caused the first typecheck to fail with `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.`, requiring another `package.json` modification before `npx tsc --noEmit` succeeded.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The run passed, but SDK discovery was source-driven rather than straightforward: the agent inspected `node_modules/mcp-use/README.md`, then `dist/server.d.ts`, `dist/resources.d.ts`, `dist/tools.d.ts`, and searched implementation files with `rg -n "listen\\("`. No skill file or external docs URL appears; the only package-level lookup was `npm view mcp-use version description repository.url --json`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had SDK-discovery friction because npm metadata provided no documentation—the query returned `"readme": ""`—so it inspected installed declarations directly with commands such as `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts`. It similarly had to grep the MCP client package for verification API shape, including `rg -n "StreamableHTTP"` and searches for `"listResources\\(|readResource\\(|callTool\\("`, rather than relying on readily surfaced examples.
