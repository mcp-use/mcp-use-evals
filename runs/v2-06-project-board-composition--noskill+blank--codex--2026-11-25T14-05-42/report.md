# mcp-use SDK agentic eval — 2026-11-25

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-25T14-05-42` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m40s
- Median turns: 16
- Median tool calls: 25
- Median tokens in/out: 628080 / 5725
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent spent discovery time querying npm rather than starting from a local guide: it ran `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, whose README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`. It then grepped installed declarations for API shape with `rg -n "resource\\(|Streamable|streamable|http" node_modules/mcp-use/dist node_modules/mcp-use -g '*.d.ts' -g '*.ts'` and inspected `node_modules/mcp-use/dist/server.d.ts` plus `resources.d.ts`, indicating that resource and HTTP APIs required type-definition discovery.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main wrong turn was installing an incompatible Zod version: the first typecheck failed because `ZodObject... is not assignable to type 'StandardSchemaWithJSON'` and specifically `Property 'jsonSchema' is missing`. The agent diagnosed this by inspecting package metadata—`require('./node_modules/zod/package.json').version` returned `3.25.76`—then switched dependencies after noting that the SDK “`expects Zod’s JSON Schema-capable v4 interface`”; the next `npm install && npx tsc --noEmit` succeeded.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm metadata and the package README with `npm view mcp-use ...` and `npm view mcp-use readme`, then inspected installed declarations using `rg -n "resource\(" node_modules/mcp-use` and `sed -n '1,460p' node_modules/mcp-use/dist/server.d.ts`. No mcp-use skill file or fetched docs URL appears in the transcript; the README only surfaced the documentation link `"https://docs.mcp-use.com/v2/typescript/getting-started/welcome"`.
