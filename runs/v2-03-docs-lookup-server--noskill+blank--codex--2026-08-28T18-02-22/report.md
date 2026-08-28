# mcp-use SDK agentic eval — 2026-08-28

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-28T18-02-22` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m45s
- Median turns: 15
- Median tool calls: 25
- Median tokens in/out: 688587 / 5819
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The clearest scaffold papercut was conflicting module configuration: `package.json` contained both `"type": "module"` and `"type": "commonjs"`, causing `TS1309: The current file is a CommonJS module and cannot use 'await' at the top level.` The agent inspected the file, removed the duplicate CommonJS setting, and then `npx tsc --noEmit` succeeded.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main discovery cost was learning the SDK API from the installed package rather than from readily surfaced npm documentation: `npm view mcp-use readme --json` returned no README content, after which the agent ran `rg -n "streamable|Streamable|resource\\(|tool\\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/config.d.ts`, and resource/tool declarations.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main wrong turn was protocol verification: the agent sent an initialize body with a modern header and received `“the request headers and body disagree: an initialize request (legacy handshake) was sent with a modern MCP-Protocol-Version header”`. It recovered by retrying without that header using body version `“2025-11-25”`, which returned `HTTP/1.1 200 OK`.
