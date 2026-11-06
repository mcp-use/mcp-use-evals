# mcp-use SDK agentic eval — 2026-11-06

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-11-06T14-05-59` · batch `42230643689-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m18s
- Median turns: 12
- Median tool calls: 18
- Median tokens in/out: 491697 / 5249
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first queried npm metadata and the package README with `npm view mcp-use version description repository.url peerDependencies dependencies --json && npm view mcp-use readme`, then inspected installed declarations using `rg -n "resource\\(|resources|streamable|listen\\(" node_modules/mcp-use` and several `sed` reads of `node_modules/mcp-use/dist/resources.d.ts`, `server.d.ts`, `tools.d.ts`, and `config.d.ts`. This suggests the package’s immediately available examples were insufficient for confidently determining resource-template, tool-schema, and listen API shapes.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent spent discovery time inspecting the installed package rather than relying on prior SDK guidance: it opened `node_modules/mcp-use/README.md` and several declaration files, then grepped for API shape with `rg -n "resourceTemplate|listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/config.d.ts node_modules/mcp-use/dist/tools.d.ts`. This inspection did uncover the needed declarative APIs, including the declaration comment `Register a parameterized resource`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK shape directly from the installed package: the agent inspected `node_modules/mcp-use/README.md`, then searched declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts` and opened `resources.d.ts`, `tools.d.ts`, and related files. No skill file or fetched documentation URL appears; the only remote metadata lookup was `npm view mcp-use version description repository.url`.
