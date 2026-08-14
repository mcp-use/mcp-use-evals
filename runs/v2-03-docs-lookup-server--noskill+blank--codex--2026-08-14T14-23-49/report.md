# mcp-use SDK agentic eval — 2026-08-14

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-08-14T14-23-49` · batch `31809130834-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m39s
- Median turns: 14
- Median tool calls: 23
- Median tokens in/out: 570692 / 6425
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had some SDK-discovery friction: it first queried the npm package metadata/readme with `npm view mcp-use readme`, then inspected installed declarations via `rg -n "resource\\(" node_modules/mcp-use` and `cat node_modules/mcp-use/dist/resources.d.ts` to learn the resource, template, tool, and `listen` API shapes. No mcp-use skill file or fetched docs page appears in the transcript; the visible resources were the npm README and `node_modules` type declarations.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent relied heavily on installed-package inspection rather than a skill file or fetched docs, reading `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/resources.d.ts`; it also grepped for API shape with `rg -n "resourceTemplate|\\.listen|listen\\(|resource\\("`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent relied heavily on installed-package inspection rather than a skill or fetched docs: it read `node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and `config.d.ts`, including grepping for `"listen\\(|resourceTemplate|resource\\("`. It also grepped the official SDK declarations for `"StreamableHTTPClientTransport"`, `"listResources("`, `"readResource("`, and `"callTool("` to build its verification client.
