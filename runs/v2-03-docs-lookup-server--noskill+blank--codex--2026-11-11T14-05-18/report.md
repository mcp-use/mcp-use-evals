# mcp-use SDK agentic eval — 2026-11-11

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-11T14-05-18` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m32s
- Median turns: 11.5
- Median tool calls: 19.5
- Median tokens in/out: 550025.5 / 5202
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

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main discovery detour was trying npm metadata first: `npm view mcp-use readme --json` produced an empty/truncated file, followed by `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, including `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/tools.d.ts`, and `node_modules/mcp-use/README.md`; it specifically grepped for `"resourceTemplate|streamable|listen\\(|inputSchema|server.tool|MCPServer"` to determine the API shape. No mcp-use skill file or fetched documentation URL appears in the transcript; the usable guidance came from package-local declarations and README content such as `[Explore MCP server tools →](https://mcp-use.com/docs/typescript/server/tools)`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main wrong turn was module/type configuration after scaffolding: `npm init -y` created `"type": "commonjs"`, and the first check failed with `Cannot find name 'process'`, `"import.meta" meta-property is not allowed in files which will build into CommonJS output`, and `The current file is a CommonJS module and cannot use 'await' at the top level.` The agent then inspected `cat package.json`, `npm ls @types/node typescript`, and `npx tsc --showConfig` before modifying both `package.json` and `tsconfig.json`; this was avoidable setup churn despite `@types/node@26.6.6` already being installed.
