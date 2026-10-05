# mcp-use SDK agentic eval — 2026-10-05

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-05T14-10-35` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m20s
- Median turns: 14
- Median tool calls: 22
- Median tokens in/out: 810204 / 5619
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had substantial API-discovery friction on a blank project. It first queried npm metadata and the package README with `npm view mcp-use version description homepage repository.url && npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "resource\\(|Resource" node_modules/mcp-use/dist node_modules/mcp-use` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`. No mcp-use skill file or fetched documentation URL appears in the transcript; the main resources were npm metadata and `node_modules` type declarations.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had notable API-discovery friction in the blank workspace. It first fetched npm metadata and the package README (`npm view mcp-use readme --json`), then searched installed declarations with `rg -n "resource\\(|\\.resource|Streamable|listen\\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts` to determine resource, template, and HTTP APIs. It also initially installed `zod@3` (`npm install mcp-use@2.7.3 zod@3`) but then replaced it with `zod@4` (`npm install zod@4`), suggesting the compatible schema version was not obvious up front.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had discovery friction in the blank workspace (`total 8 ... . ..`): it first queried npm with `npm view mcp-use version description repository.url` and fetched the package README, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`. It then relied on installed-package inspection rather than a skill file, grepping `node_modules/mcp-use` for `"resource\\(|resources|listen\\(|Streamable|streamable"` and reading `dist/resources.d.ts`, `dist/server.d.ts`, and `dist/config.d.ts` to determine the resource and listener APIs.
