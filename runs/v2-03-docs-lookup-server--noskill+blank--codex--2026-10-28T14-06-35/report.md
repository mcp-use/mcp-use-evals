# mcp-use SDK agentic eval — 2026-10-28

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-28T14-06-35` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m20s
- Median turns: 13
- Median tool calls: 23
- Median tokens in/out: 680685 / 5984
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had discovery friction around the SDK API and leaned heavily on the published package and installed declarations: it first fetched `npm view mcp-use readme --json`, then searched with `rg -n "resource\\(|resourceTemplate|ResourceTemplate|\\.resource" node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`. One API-shape probe failed because it assumed a JavaScript file existed—`rg: node_modules/mcp-use/dist/server.js: No such file or directory`—before it recovered by reading the declaration files, including the documented `listen(port?: number...)` signature.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The main friction was SDK API discovery: with no scaffold or skill, the agent inspected the installed package directly, running `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, `resources.d.ts`, `tools.d.ts`, and grepping `rg -n "listen\\(" node_modules/mcp-use/dist/...`. This worked, but contributed several exploratory calls before implementation; the agent explicitly summarized that it had to confirm “`declarative static and templated resources plus streamable HTTP through server.listen()`.” No external docs URL or mcp-use skill file was used in the visible transcript.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The agent had API-discovery friction: it first queried npm metadata with `npm view mcp-use version description repository.url dist-tags --json`, fetched the package README via `npm view mcp-use@2.12.0 readme`, and then grepped installed internals with `rg -n "resource\\(" node_modules/mcp-use/dist node_modules/mcp-use`. It ultimately relied on declaration files including `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/resources.d.ts` to determine resource callbacks, templates, and `listen()` shape.
