# mcp-use SDK agentic eval — 2026-10-09

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-09T14-08-47` · batch `37941801895-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m21s
- Median turns: 12
- Median tool calls: 20
- Median tokens in/out: 518471 / 3906
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm with `npm view mcp-use readme --json`, but the output contained only package metadata such as `"version": "2.8.2"`. It then leaned heavily on installed package internals, searching `node_modules/mcp-use/README.md` and `node_modules/mcp-use/dist` for `"streamable|Streamable|http|tool\\("`, followed by several targeted reads of `server.d.ts`, `config.d.ts`, `index.d.ts`, and `mount-mcp.d.ts` to establish the `MCPServer`, `tool`, `basePath`, and `listen` API shapes.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main time sink was API discovery: the agent queried npm metadata with `npm view mcp-use version description repository.url dist.tarball --json`, downloaded the package via `npm pack mcp-use@2.8.2 --silent`, attempted to inspect `package/README.md`, and then searched bundled declarations using `sed -n '1,280p' .../dist/server.d.ts` and `rg -n "listen'\\(|serve\\(|stream"`. This suggests the package’s basic server/listen shape was not immediately discoverable from the initial npm readme lookup, whose visible output contained only metadata such as `"description": "MCP framework and CLI built on the official v2 SDK"`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API and protocol discovery. The agent first tried npm metadata/README, but `npm view mcp-use readme --json` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, and the fallback `npm view mcp-use readme` returned an empty output. It then relied heavily on installed declarations and implementation searches, including `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "createServer|tool\\(|streamable|listen\\(" node_modules/mcp-use/dist`, which revealed the useful listener contract: `listen(port?: number | undefined, options?: ListenOptions)`.
