# mcp-use SDK agentic eval — 2026-08-21

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-21T14-13-39` · batch `32490814233-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m02s
- Median turns: 13
- Median tool calls: 16
- Median tokens in/out: 421621 / 3168
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm metadata and the package README with `npm view mcp-use version description repository.url dist-tags --json && npm view mcp-use readme --json`, then explicitly said it was “`checking the installed SDK’s HTTP entry points`.” It subsequently grepped the installed package—`rg -n "streamable|listen\(|serve\(|http" node_modules/mcp-use/dist node_modules/mcp-use/README.md`—and inspected declaration files including `node_modules/mcp-use/dist/server.d.ts`, where it found the `listen(port?: number...)` API. This suggests the README/npm metadata alone did not immediately provide enough concrete server API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had to discover the API from the installed package, first inspecting `node_modules/mcp-use/README.md`, then declarations with `sed -n '1,300p' node_modules/mcp-use/dist/server.d.ts`, and finally grepping for transport startup via `rg -n "listen\(|serve\(|streamable|Streamable"`. The declaration file was particularly useful because it contained the exact shape later implemented: `inputSchema: z.object({ a: z.number(), b: z.number() })` and `await server.listen(3000);`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent relied first on npm package metadata and the published README, fetching `npm view mcp-use readme` and finding the documentation link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but it did not visibly fetch that docs URL. It then inspected installed declarations to discover the API shape, using `rg -n "class MCPServer|serve\(|listen\(|streamable|http" node_modules/mcp-use...` followed by `sed` on `node_modules/mcp-use/dist/server.d.ts` and `config.d.ts`.
