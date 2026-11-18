# mcp-use SDK agentic eval — 2026-11-18

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-18T14-05-04` · batch `44320100226-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m09s
- Median turns: 13
- Median tool calls: 18
- Median tokens in/out: 416698 / 3754
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery friction was the failed npm README lookup: `SyntaxError: Unexpected end of JSON input`. The agent recovered by inspecting the installed package directly, using `rg -n "Streamable|streamable|HTTP|create.*Server|MCPServer|McpServer" node_modules/mcp-use` and reading `node_modules/mcp-use/README.md` plus declaration files such as `node_modules/mcp-use/dist/server.d.ts`; no skill file or external docs URL appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent relied on installed-package discovery rather than a skill file or fetched docs: it ran `npm view mcp-use version description repository.url --json`, searched `node_modules/mcp-use` for `"Streamable|streamable|MCPServer|createMCP|tool\\("`, and read `node_modules/mcp-use/README.md` plus declaration files such as `dist/server.d.ts` and `dist/tools.d.ts`. API discovery had a small wrong turn when the search assumed `node_modules/mcp-use/dist/index-node.d.ts`; the command failed with `No such file or directory`, requiring a follow-up focused on `dist/server.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had notable API-discovery overhead because the blank setup provided no local guidance: it first queried npm with `npm view mcp-use version description repository.url`, then downloaded and unpacked the package via `npm pack mcp-use --silent`, and searched bundled declarations using `rg -n "Streamable|streamable|createMcpServer|MCPServer|tool\("`. It leaned on the packaged README and type declarations rather than a skill file or fetched docs URL, inspecting `/tmp/mcp-use-inspect/package/README.md`, `/tmp/mcp-use-inspect/package/dist/server.d.ts`, and `/tmp/mcp-use-inspect/package/dist/config.d.ts`; the declaration that ultimately clarified startup was `listen(port?: number | undefined, options?: ListenOptions): Promise<{ ... url: string; }>`.
