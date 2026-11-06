# mcp-use SDK agentic eval — 2026-11-06

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-06T14-06-01` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m09s
- Median turns: 15
- Median tool calls: 22
- Median tokens in/out: 522171 / 4295
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main wrong turn came from fighting the npm scaffold: `npm init -y` created `"type": "commonjs"`, and the edited package temporarily contained both `"type": "module"` and `"type": "commonjs"`. That produced `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.`; removing the duplicate CommonJS setting fixed the typecheck.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent time discovering the API rather than using a direct example: it fetched the npm README (`npm view mcp-use readme`) and then inspected installed declarations with `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts` and `rg -n "listen\\(|Streamable|streamable..." node_modules/mcp-use/dist`. This worked, but indicates the package README alone did not immediately provide enough implementation detail.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent spent early effort discovering the SDK shape rather than relying on a skill file: it fetched npm metadata/readme with `npm view mcp-use readme --json`, then searched installed declarations using `rg -n "listen\(|serve\(|start\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/dist/server.d.ts` and `tools.d.ts`. This worked, but indicates the package readme alone did not immediately provide enough implementation detail.
