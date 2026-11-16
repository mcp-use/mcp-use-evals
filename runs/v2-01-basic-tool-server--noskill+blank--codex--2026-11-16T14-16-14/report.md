# mcp-use SDK agentic eval — 2026-11-16

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-16T14-16-14` · batch `43883718263-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m22s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 395682 / 3609
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): API discovery was manual: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then downloaded and unpacked the package using `npm pack mcp-use --silent` and inspected `.tmp-mcp-use/package/README.md` plus `.tmp-mcp-use/package/dist/server.d.ts`. It specifically grepped the declarations with `rg -n "listen\\("`, finding `listen(port?: number | undefined, options?: ListenOptions)`, rather than relying on a skill file or fetched docs URL.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent several calls discovering the SDK API rather than coding immediately: it queried npm with `npm view mcp-use version description repository.url dist-tags --json`, grepped the installed package using `rg -n "streamable|Streamable|http|tool\(" node_modules/mcp-use`, read the README quickstart, and inspected `node_modules/mcp-use/dist/server.d.ts` to confirm `listen(port?)`. This package-local documentation and type inspection ultimately supplied the correct `MCPServer`, `server.tool(...)`, and `server.listen(port)` shapes.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main time sink was API discovery in the blank workspace. Before implementation, the agent queried npm metadata with `npm view mcp-use version description repository.url dist-tags --json`, fetched the repository README via `curl -fsSL https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`, and then inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` plus `rg -n "listen\\(" ...`. This suggests the basic `MCPServer` constructor, `tool`, and `listen` shape was not immediately discoverable from one concise source.
