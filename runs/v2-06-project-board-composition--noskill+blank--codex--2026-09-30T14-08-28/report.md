# mcp-use SDK agentic eval — 2026-09-30

Run `v2-06-project-board-composition--noskill+blank--codex--2026-09-30T14-08-28` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m21s
- Median turns: 19
- Median tool calls: 29
- Median tokens in/out: 793866 / 7365
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The agent had some SDK-discovery friction before implementation. It first queried npm metadata and the package README with `npm view mcp-use readme`, which surfaced the documentation URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but there is no evidence it fetched that documentation directly. It then inspected installed declarations and runtime files using `rg -n "resource\\(" node_modules/mcp-use` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, suggesting the README alone did not provide enough API shape for resources, templates, and `listen()`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main time sink was dependency installation: two attempts failed with `npm error 404 Not Found - GET https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz`. The agent investigated registry metadata via `npm view source-map-js versions --json`, checked the tarball with `curl -I`, and inspected Git tags with `git ls-remote --tags https://github.com/7rulnik/source-map-js.git`. It ultimately worked around the registry issue by adding `"source-map-js": "github:7rulnik/source-map-js#0a1d334fd1e55a47df97fcd60a7915d46df3b08a"` under `overrides` in `package.json`; npm then warned that it was `skipping integrity check for git dependency`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had API-discovery friction and relied first on npm metadata/readme (`npm view mcp-use readme`) and then direct package inspection via `rg -n "resource\(|streamable|listen\(|http" node_modules/mcp-use/dist` plus `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`; the README mainly pointed onward to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, so the installed declarations supplied the concrete API shape.
