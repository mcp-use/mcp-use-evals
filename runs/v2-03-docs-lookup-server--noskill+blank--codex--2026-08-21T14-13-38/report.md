# mcp-use SDK agentic eval — 2026-08-21

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-21T14-13-38` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m52s
- Median turns: 16
- Median tool calls: 22
- Median tokens in/out: 657497 / 6309
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had to discover the SDK API from the installed package rather than a skill or external docs: it ran `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts`, inspected `server.d.ts`, `resources.d.ts`, and `tools.d.ts`, and searched for `"resourceTemplate|listen\\("` in the README and built JavaScript. Before that, it also queried npm metadata with `npm view mcp-use version description repository.url --json`, suggesting some initial package/version discovery overhead.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had substantial SDK-discovery work in the blank directory: it first queried npm with `npm view mcp-use version description repository.url dist.tarball`, then read `node_modules/mcp-use/README.md`, and finally inspected declarations including `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `config.d.ts`, and `tools.d.ts` while grepping for `resource(` and `listen(`. No skill file or fetched docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main wrong turn was a dependency-version mismatch: the first typecheck failed because the installed Zod schema lacked the SDK-required `jsonSchema` property (`Property 'jsonSchema' is missing`), which also left `query` typed as unknown (`'query' is of type 'unknown'`). The agent additionally omitted Node typings initially, producing `Cannot find name 'process'`; it recovered by running `npm install zod@'^4.0.0' && npm install --save-dev @types/node`, after which `npx tsc --noEmit` passed.
