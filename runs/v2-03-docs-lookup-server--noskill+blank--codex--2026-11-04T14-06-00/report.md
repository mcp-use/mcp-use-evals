# mcp-use SDK agentic eval — 2026-11-04

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-04T14-06-00` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m26s
- Median turns: 15
- Median tool calls: 23
- Median tokens in/out: 511292 / 4801
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had initial API-discovery friction and relied heavily on package internals, first grepping with `rg -n "Streamable|streamable|createServer|resource\\(|tool\\(" node_modules/mcp-use` and then reading `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, `dist/config.d.ts`, and transport declarations. It found the public docs link in the README—`https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—but did not fetch it, instead deriving the resource/template and HTTP API shapes from installed declarations.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main SDK compatibility papercut was Zod versioning: the agent first installed `zod@3.24.2`, then changed to `zod@4.1.13`, but typechecking still failed because `Property 'jsonSchema' is missing`; only `npm install zod@latest` at version `4.6.7` made `npx tsc --noEmit` pass. This also caused downstream inference failure: `'query' is of type 'unknown'`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK directly from the installed package: the agent ran `npm view mcp-use version description peerDependencies dependencies --json`, then searched `node_modules/mcp-use` for `"Streamable|streamable|createMcp|resource\\(|tool\\("`, and inspected `README.md` plus declarations including `dist/server.d.ts`, `dist/resources.d.ts`, and `dist/node-http.d.ts`. No skill file or external docs URL appears in the transcript.
