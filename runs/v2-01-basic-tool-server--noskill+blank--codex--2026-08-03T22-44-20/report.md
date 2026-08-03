# mcp-use SDK agentic eval — 2026-08-03

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-03T22-44-20` · batch `30859637568-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 1 trial(s)

## Pass rate: 100% (1/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 1/1 |

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 375521 / 3478
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 1

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent notable time discovering the SDK shape rather than coding directly: it first queried npm with `npm view mcp-use version description repository.url dist-tags --json`, then inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/server.d.ts`, and grepped `listen(` in the installed package. The npm README query produced only package metadata in the visible output, so the useful API confirmation appears to have come from installed declarations and implementation files, culminating in: `The current SDK exposes its streamable HTTP route at \`/mcp\`; I’ve confirmed the native \`MCPServer.listen()\` API`.
