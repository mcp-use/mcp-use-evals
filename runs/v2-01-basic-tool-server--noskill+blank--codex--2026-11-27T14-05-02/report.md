# mcp-use SDK agentic eval — 2026-11-27

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-27T14-05-02` · batch `46012491642-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

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
- Median tool calls: 17
- Median tokens in/out: 425532 / 3543
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery: the agent first fetched the package metadata and entire README with `npm view mcp-use readme --json`, then searched installed files using `rg -n "listen\\(|serve\\(|Streamable|streamable|MCPServer" node_modules/mcp-use`, which produced noisy minified output such as `node_modules/mcp-use/dist/mcp-proxy-YSI2UFBY.js`. It ultimately relied on the installed type declarations, especially `node_modules/mcp-use/dist/server.d.ts`, where it found `listen(port?: number | undefined, options?: ListenOptions)` and the documented precedence `the argument, PORT, config.port, then 3000`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent spent discovery time querying npm (`npm view mcp-use version description repository.url dist.tarball` and `npm view mcp-use readme --json`) and then inspecting installed SDK declarations with `rg -n "class MCPServer|serve\(|listen\(|streamable|HTTP" node_modules/mcp-use...` plus `sed` on `node_modules/mcp-use/dist/server.d.ts`; this suggests the README alone did not provide enough immediately usable API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main wrong turn was an incorrect `listen` call: the first typecheck reported `Argument of type '{ port: number; }' is not assignable to parameter of type 'number'`. The agent then had to inspect installed declarations with `rg -n "class MCPServer|listen\\(" node_modules/mcp-use -g '*.d.ts'`, finding `listen(port?: number | undefined, options?: ListenOptions)`, before changing the source to `void server.listen(port);` (`src/server.ts`). The initial setup also omitted Node typings, producing `Cannot find name 'process'. Do you need to install type definitions for node?`, which required another package edit and install.
