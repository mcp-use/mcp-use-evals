# mcp-use SDK agentic eval — 2026-08-07

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-07T14-23-33` · batch `31187187397-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m22s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 536413 / 5754
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had SDK-discovery friction: `npm view mcp-use readme --json` yielded no README content, so it inspected installed package internals with `find node_modules/mcp-use` and `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, eventually concluding that “`The SDK supports streamable HTTP directly via MCPServer.listen()`.” No skill file or external docs URL appears; the concrete resources used were the npm metadata (`npm view mcp-use version description repository.url`) and `node_modules/mcp-use` README/type declarations.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): The main SDK discovery friction was API-shape lookup: after checking npm metadata with `npm view mcp-use version description repository.url`, the agent grepped the installed package for `"streamable|Streamable|createServer|tool\\("` and inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/mount-mcp.d.ts`, and `dist/node-bridge.d.ts` before settling on `await server.listen(port)`. No mcp-use skill file or external docs URL was used; the transcript shows reliance on the package README and declaration files.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): API discovery required inspecting the installed package rather than relying on prior knowledge: the agent ran `npm view mcp-use version description repository.url peerDependencies dependencies --json`, then searched `node_modules/mcp-use/README.md` and declarations with `rg -n "serve|listen|streamable|server\\.start|MCPServer"`. It ultimately found the needed API in `node_modules/mcp-use/dist/server.d.ts:343`, quoted as `listen(port?: number | undefined, options?: ListenOptions)`; no skill file or external docs URL appears in the transcript.
