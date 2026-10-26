# mcp-use SDK agentic eval — 2026-10-26

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-26T14-56-43` · batch `40344106354-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m42s
- Median turns: 18
- Median tool calls: 22
- Median tokens in/out: 636691 / 5802
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent relied heavily on installed package internals rather than external docs, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts` via commands such as `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`; no skill file or fetched docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had discovery friction around the SDK API and leaned heavily on installed package internals, first reading `node_modules/mcp-use/README.md` and `package.json`, then inspecting `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`; the transcript explicitly shows `rg -n "listen\\(|resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist -g '*.d.ts'`. It also explored the CLI and client package via `npx mcp-use --help`, `npx mcp-use client --help`, and a grep for `StreamableHTTPClientTransport`. No skill file or external docs URL appears in the transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on installed package declarations rather than docs or a skill file, inspecting `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, and `tools.d.ts`, including the discovered signature `listen(port?: number | undefined, options?: ListenOptions)`. It also queried npm metadata first with `npm view mcp-use version description repository.url peerDependencies dependencies --json`.
