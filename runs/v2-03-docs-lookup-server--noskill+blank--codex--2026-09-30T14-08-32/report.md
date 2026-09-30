# mcp-use SDK agentic eval — 2026-09-30

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-09-30T14-08-32` · batch `36726652037-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m56s
- Median turns: 19
- Median tool calls: 23
- Median tokens in/out: 687781 / 5352
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent spent substantial discovery effort on package internals before implementation: it fetched npm metadata and the full README with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, inspected the tarball via `npm pack mcp-use@2.7.2 --dry-run --json`, and then read SDK declarations using `sed -n '1,260p' node_modules/mcp-use/dist/resources.d.ts` and `server.d.ts`. It relied especially on installed type declarations to discover `resource`, `resourceTemplate`, and `listen`, stating, `The SDK supports both fixed resources and URI templates directly`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main time sink was dependency installation: two attempts failed with `npm error 404 Not Found - GET https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz`, despite metadata still advertising that tarball as `"tarball": "https://registry.npmjs.org/source-map-js/-/source-map-js-1.2.2.tgz"`. The agent investigated availability directly with `curl -I` and checked older releases, finding `1.1.0 200`; after modifying `package.json`, installation succeeded with `added 55 packages`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main time sink was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url dist-tags.latest`, then fetched the full package README via `npm view mcp-use readme --json`, and finally grepped installed declarations with `rg -n "class MCPServer|resourceTemplate|resource\\(" node_modules/mcp-use/dist -g '*.d.ts'`. It also inspected several SDK declaration files directly, including `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `config.d.ts`; no mcp-use skill file or separately fetched docs URL appears in the transcript.
