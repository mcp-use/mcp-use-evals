# mcp-use SDK agentic eval — 2026-09-30

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-30T14-08-29` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 516506 / 3715
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had moderate API-discovery friction on a blank workspace. It first fetched npm metadata and the full package README via `npm view mcp-use readme --json`, then inspected installed declarations with `sed -n '1,240p' node_modules/mcp-use/dist/index.d.ts` and searched API details using `rg -n "listen\(|securitySchemes|noauth..." node_modules/mcp-use/...`. No mcp-use skill file or fetched docs URL appears; although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, the agent relied on npm content and `node_modules` declarations instead.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The largest delay was dependency installation: two attempts failed on the same transitive tarball with `E404 Not Found - GET https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz`. The agent investigated with `npm view source-map-js versions --json`, `npm cache verify`, and `curl -I`, then added the workaround shown in `package.json`: `"overrides": { "source-map-js": "1.2.1" }`, after which installation succeeded.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main delay was dependency installation rather than SDK implementation: the first `npm install` failed with `npm error 404 Not Found - GET https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz`, and the agent recovered by running `npm cache clean --force && npm install --registry=https://registry.npmjs.org/`.
