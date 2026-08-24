# mcp-use SDK agentic eval — 2026-08-24

Run `v2-06-project-board-composition--noskill+blank--codex--2026-08-24T14-16-06` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m34s
- Median turns: 14
- Median tool calls: 24
- Median tokens in/out: 706818 / 5861
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The run had moderate API-discovery friction: it first queried the npm metadata/readme with `npm view mcp-use version description repository.url && npm view mcp-use readme --json`, then inspected installed declarations using `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts`. This suggests the package README alone did not supply enough concrete resource/template and listener signatures for implementation.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent needed API-shape discovery before implementation, first fetching the package metadata/readme with `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then grepping installed internals via `rg -n "resource\\(|resources|listen\\(|serve\\(|Streamable" node_modules/mcp-use/dist node_modules/mcp-use/README.md` and reading `node_modules/mcp-use/dist/resources.d.ts` plus `server.d.ts`. This suggests the resource/resource-template and HTTP APIs were not obvious from the initial package surface.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had API-discovery friction and leaned first on the npm README—`npm view mcp-use readme --json` exposed the docs link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—then inspected installed declarations with `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts` and related `resources.d.ts`/`tools.d.ts` files to determine registration and `listen` shapes. No mcp-use skill file was used in the visible transcript.
