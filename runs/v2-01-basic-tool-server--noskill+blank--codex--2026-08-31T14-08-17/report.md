# mcp-use SDK agentic eval — 2026-08-31

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-31T14-08-17` · batch `33400724205-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m17s
- Median turns: 12
- Median tool calls: 17
- Median tokens in/out: 372761 / 3390
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main SDK papercut was uncertainty around the HTTP startup API. The agent said it would “`confirm the SDK’s HTTP startup API against the installed types`” and grepped `node_modules/mcp-use/dist/server.d.ts` / `index.d.ts`; its initial call passed an object and failed with `Argument of type '{ port: number; }' is not assignable to parameter of type 'number'.` It then changed the source to `await server.listen(port);` (`src/server.ts`), which typechecked.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent early effort discovering the SDK API from the installed package rather than using a skill or external docs: it ran `rg -n "streamable|Streamable|MCPServer|createMCP|tool\(" node_modules/mcp-use` and inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, and `dist/tools.d.ts`. This yielded the needed examples and listener contract, including `await server.listen(3000)` and `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The run was largely direct, but API discovery required external inspection: the agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and `npm view mcp-use readme --json`, then grepped installed declarations using `rg -n "class MCPServer|listen\\(|streamable|serve\\(" node_modules/mcp-use/dist node_modules/mcp-use`. It specifically opened `node_modules/mcp-use/dist/server.d.ts` to confirm the `MCPServer` constructor and `listen(port?)` shape, suggesting the package README alone did not provide enough immediately usable API detail.
