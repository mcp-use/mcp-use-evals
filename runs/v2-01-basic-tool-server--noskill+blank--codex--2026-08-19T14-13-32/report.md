# mcp-use SDK agentic eval — 2026-08-19

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-19T14-13-32` · batch `32262528378-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m27s
- Median turns: 14
- Median tool calls: 21
- Median tokens in/out: 552638 / 3961
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent relied on npm metadata and local package internals rather than a skill file or external docs: it ran `npm view mcp-use version description repository.url dist-tags --json`, then inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/server.d.ts`, and searched with `rg -n "listen\\(" node_modules/mcp-use/...` to discover the API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than a skill or external docs: it grepped `node_modules/mcp-use` for `"streamable|Streamable|HTTP|...|server\\.tool"` and then read `node_modules/mcp-use/README.md` plus `node_modules/mcp-use/dist/server.d.ts`. This successfully revealed the concise API shape, including `server.tool(...)` and the listener documentation, after which the first `npx tsc --noEmit` passed.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main time cost was SDK discovery in a blank workspace: the agent first queried npm with `npm view mcp-use version description repository.url --json && npm view mcp-use readme --json`, then packed and inspected the package via `npm pack mcp-use` and `tar -xOf /tmp/mcp-use-2.2.4.tgz package/dist/server.d.ts`. The npm readme query returned only package metadata—`"version": "2.2.4"` and `"description": "MCP framework and CLI built on the official v2 SDK"`—so the agent relied on the tarball’s README and declaration files to find the API shape, including `listen(port?: number | undefined...` and the example `await server.listen(3000);`. Although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, there is no transcript evidence that the agent fetched that documentation or used a skill file.
