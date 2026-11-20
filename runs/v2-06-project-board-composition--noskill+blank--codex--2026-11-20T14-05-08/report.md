# mcp-use SDK agentic eval — 2026-11-20

Run `v2-06-project-board-composition--noskill+blank--codex--2026-11-20T14-05-08` · batch `44749832704-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m53s
- Median turns: 16
- Median tool calls: 24
- Median tokens in/out: 707464 / 6750
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main friction was API discovery in a blank workspace. The agent first queried npm metadata with `npm view mcp-use version description repository.url`, then read `node_modules/mcp-use/README.md`, and finally inspected declaration files such as `node_modules/mcp-use/dist/resources.d.ts` and grepped for `listen(`. That declaration-file probe partially failed with `exitCode":2` because it requested paths including `node_modules/mcp-use/dist/node-http.d.ts` and `node_modules/mcp-use/dist/index-node.d.ts`, suggesting the package layout was not immediately obvious. It did not fetch the README’s linked docs URL, although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than a skill or external docs: it opened `node_modules/mcp-use/README.md`, then queried SDK declarations with `sed ... node_modules/mcp-use/dist/server.d.ts` and `rg -n "Streamable|streamable|listen\(|resource\("`. It later searched the bundled MCP client API via `rg -n "StreamableHTTPClientTransport"` and inspected `node_modules/@modelcontextprotocol/client/dist/index.d.mts`, suggesting client-side verification setup was not immediately discoverable.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent had discovery friction on the SDK API and relied first on npm metadata/readme—`npm view mcp-use readme --json` exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—then inspected installed declarations with `rg -n "resource\\(" node_modules/mcp-use/dist` and `sed -n '1,280p' node_modules/mcp-use/dist/server.d.ts`. No skill file was used in the visible transcript.
