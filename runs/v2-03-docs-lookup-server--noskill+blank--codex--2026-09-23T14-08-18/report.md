# mcp-use SDK agentic eval — 2026-09-23

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-23T14-08-18` · batch `35871723475-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m46s
- Median turns: 14
- Median tool calls: 25
- Median tokens in/out: 587231 / 4998
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK shape rather than relying on a provided skill: it first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and read the package README, whose output pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`. It then inspected installed declarations directly via `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `sed -n '1,220p' node_modules/mcp-use/dist/resources.d.ts`, suggesting API discovery friction around resources, templates, and `listen()`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main wrong turn was module configuration: `npm init -y` created `"type": "commonjs"`, while `src/server.ts` used top-level await, producing `error TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent then modified `package.json`, after which `npx tsc --noEmit` passed.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had to discover the SDK API from package metadata and installed declarations rather than an available skill: it first ran `npm view mcp-use version readme --json`, then searched internals with `rg -n "resource\(|listen\(|serve\(|Streamable|streamable" node_modules/mcp-use/dist node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`. This suggests some friction finding the exact `resourceTemplate`, callback, and HTTP-listening shapes.
