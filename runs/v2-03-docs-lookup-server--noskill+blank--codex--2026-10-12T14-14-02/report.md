# mcp-use SDK agentic eval — 2026-10-12

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-12T14-14-02` · batch `38261194189-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m26s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 381629 / 5461
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): SDK discovery had some friction: the agent first tried `npm view mcp-use readme --json`, but parsing failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then relied on the installed package, grepping `node_modules/mcp-use/README.md` and declaration files for `"streamable|Streamable|resource\\(|tool\\(|MCPServer|McpServer|http"`, and inspected `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, `config.d.ts`, and `tools.d.ts` to determine the API shape.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery friction was finding the SDK API shape. The agent first queried npm with `npm view mcp-use readme --json`, but the visible result only contained package metadata such as `"version": "2.8.2"`. It then relied heavily on installed-package inspection, grepping `node_modules/mcp-use` for `"Streamable|streamable|resource\\(|tool\\(|class MCP"` and reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/config.d.ts`. The README itself pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main implementation detour came from the scaffolded package metadata: `package.json` contained both `"type": "module"` and a later `"type": "commonjs"`, producing `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent inspected the file, removed the duplicate CommonJS setting, and then `npx tsc --noEmit` succeeded.
