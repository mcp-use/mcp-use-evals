# mcp-use SDK agentic eval — 2026-08-12

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-12T14-27-38` · batch `31606723866-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m08s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 354910 / 3399
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): Initial API discovery had friction: fetching the npm README as JSON failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, and the plain fallback `npm view mcp-use readme` returned empty output. The agent then relied on installed-package materials, explicitly inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/dist/tools.d.ts`; grepping declarations revealed `listen(port?: number | undefined, options?: ListenOptions)` and documentation that the default considers `PORT`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent several discovery steps establishing the v2 API: it queried npm (`npm view mcp-use version description repository.url dist.tarball`), fetched the repository README (`curl ... mcp-use/main/README.md`), and fetched `https://mcp-use.com/prompt.md`. That prompt was poorly matched to this small server task because it directed the agent to “`Login to the CLI`,” “`Install the mcp-use skill`,” scaffold “`--template mcp-apps`,” and “`Deploy`”; the agent instead proceeded manually.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use readme --json`, but the result only showed package metadata (`"version": "2.1.1"` and `"description": "MCP framework and CLI built on the official v2 SDK"`), so it installed the package and inspected local internals instead. It repeatedly searched declarations and bundles with `find node_modules/mcp-use`, `rg -n "listen\\(|streamable|node-http|serve"`, and `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts` before concluding that “`The installed SDK provides MCPServer.listen`.” This suggests the basic streamable-HTTP startup API was not immediately discoverable from npm-facing documentation.
