# mcp-use SDK agentic eval — 2026-09-18

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-18T14-07-45` · batch `35354129272-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m58s
- Median turns: 11
- Median tool calls: 21
- Median tokens in/out: 429431 / 4756
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main time sink was API discovery in a blank workspace. The agent queried npm metadata with `npm view mcp-use version description repository.url dist-tags --json`, packed the package via `npm pack mcp-use@2.5.0`, and inspected bundled declarations such as `package/dist/resources.d.ts`, `package/dist/tools.d.ts`, and `package/dist/server.d.ts`. It also relied on the packaged README’s documentation link, `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, rather than a skill file; no skill-file use appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was SDK discovery. The agent first queried npm with `npm view mcp-use readme --json`, but the output contained only package metadata (`"version": "2.5.0"` and `"repository.url"`), so it did not obtain usable README guidance there. It then tried `require.resolve('mcp-use/package.json')`, which failed because `Package subpath './package.json' is not defined by "exports"`. Recovery required inspecting the installed package directly: `find node_modules/mcp-use -maxdepth 3 -type f`, reading `node_modules/mcp-use/README.md`, and grepping declaration files with `rg -n -i "resource|listen\\(|streamable|node-http"`; in particular, it examined `node_modules/mcp-use/dist/resources.d.ts` and `node_modules/mcp-use/dist/server.d.ts` to discover resource callback and `listen` shapes.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied on npm metadata and local package internals rather than a skill file or fetched docs: it ran `npm view mcp-use version description --json`, inspected `node_modules/mcp-use/README.md`, and grepped `node_modules/mcp-use/dist/server.d.ts` for `"listen\\(|resourceTemplate|resource\\("`. That discovery path had a small dead end when the combined inspection command exited 2 after requesting `node_modules/mcp-use/dist/resources.d.ts`.
