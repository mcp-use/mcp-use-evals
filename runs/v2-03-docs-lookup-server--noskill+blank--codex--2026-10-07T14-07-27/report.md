# mcp-use SDK agentic eval — 2026-10-07

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-07T14-07-27` · batch `37633826101-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m42s
- Median turns: 14
- Median tool calls: 24
- Median tokens in/out: 706554 / 5183
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent spent discovery time querying npm—`npm view mcp-use version description repository.url` and `npm view mcp-use readme --json`—then inspected installed declarations directly with `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts` and `sed -n '1,220p' node_modules/mcp-use/dist/resources.d.ts` to determine the API shape.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied first on the npm README rather than a skill file, fetching `npm view mcp-use readme`, then inspected installed declarations with `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,180p' node_modules/mcp-use/dist/resources.d.ts` to determine the resource API shape.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had to discover the SDK shape rather than relying on a skill: it first fetched npm metadata/readme with `npm view mcp-use readme --json`, then grepped installed declarations using `rg -n "resource\\(|resources|listen\\(|start\\(" node_modules/mcp-use/dist`, and inspected `node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts`. This worked, but indicates API-discovery friction around resources, templates, and startup.
