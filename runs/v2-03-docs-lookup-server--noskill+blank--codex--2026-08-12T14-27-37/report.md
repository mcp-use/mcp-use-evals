# mcp-use SDK agentic eval — 2026-08-12

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-12T14-27-37` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m08s
- Median turns: 16
- Median tool calls: 31
- Median tokens in/out: 799961 / 7008
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape from the installed package rather than an available skill, inspecting `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/tools.d.ts` after announcing that “`The installed SDK provides the needed streamable HTTP endpoint at /mcp`.” The initial TypeScript setup fought the npm scaffold’s CommonJS default: `package.json` began with `"type": "commonjs"`, and typechecking failed with “`The 'import.meta' meta-property is not allowed in files which will build into CommonJS output`,” “`Cannot find name 'process'`,” and “`The current file is a CommonJS module and cannot use 'await' at the top level`”; the agent then changed the package to `"type": "module"` and adjusted `tsconfig.json`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied on npm metadata and installed-package inspection rather than a skill file or fetched docs URL: `npm view mcp-use version description repository.url --json`, followed by `sed -n '1,220p' node_modules/mcp-use/README.md` and direct inspection of `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. This suggests API-shape discovery required several node_modules searches, including `rg -n "listen\\(" ...` and `rg -n "resourceTemplate|resource\\(" node_modules/mcp-use/README.md`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery friction was API-shape lookup: after reading `node_modules/mcp-use/README.md`, the agent grepped installed declarations with `rg -n "resource\\(|streamable|listen\\(|serve\\(" ...` and then inspected `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts`. This worked, but indicates the package README alone did not immediately supply enough detail for static resources, URI templates, and `listen()`.
