# mcp-use SDK agentic eval — 2026-10-05

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-05T14-10-39` · batch `37322335339-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 0m59s
- Median turns: 10
- Median tool calls: 13
- Median tokens in/out: 337964 / 3205
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied first on npm package metadata and the bundled README via `npm view mcp-use readme --json`, which exposed the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`; it then inspected the installed package with `rg -n "listen\\(|serve\\(|Streamable|streamable" node_modules/mcp-use/dist node_modules/mcp-use`. This suggests some API-discovery friction, though it quickly concluded that the SDK provides a native `listen()` method and `/mcp` endpoint.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had to discover the SDK shape manually rather than relying on a skill or scaffold: it first queried npm with `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then inspected installed declarations using `sed -n '1,420p' node_modules/mcp-use/dist/server.d.ts` and searched for transport APIs with `rg -n "listen\\(|streamable|http" node_modules/mcp-use/dist -g '*.d.ts'`. This indicates some API-discovery friction around the listener and typed tool registration, although the declarations were sufficient for the agent to conclude, `The SDK provides a native stateless streamable-HTTP listener at \`/mcp\`.`
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main time cost was API discovery: the agent first queried npm metadata and the package README with `npm view mcp-use version description repository.url dist.tarball` and `npm view mcp-use readme`, then searched installed SDK files using `rg -n "listen\(|Streamable|HTTP|serve\(" node_modules/mcp-use/dist`. It ultimately relied on declaration files, inspecting `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/tools.d.ts`, to determine the `MCPServer.listen` and typed tool APIs.
