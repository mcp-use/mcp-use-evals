# mcp-use SDK agentic eval — 2026-11-20

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-20T14-05-08` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m47s
- Median turns: 16.5
- Median tool calls: 28
- Median tokens in/out: 975806 / 6355
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

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK API by inspecting the installed package rather than relying on a skill or fetched documentation: `sed -n '1,240p' node_modules/mcp-use/README.md`, followed by `cat node_modules/mcp-use/dist/server.d.ts; cat node_modules/mcp-use/dist/resources.d.ts`. This suggests some API-shape discovery friction around `MCPServer`, resources, tools, and `listen`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main wrong turn was initial module/TypeScript configuration: `npm init -y` generated `"type": "commonjs"`, after which the first `npx tsc --noEmit` failed with `Cannot find name 'process'` and `The current file is a CommonJS module and cannot use 'await' at the top level.` The agent then inspected `package.json` and installed typings via `npm ls @types/node typescript`, modified `package.json` and `tsconfig.json`, and reran typechecking successfully.
