# mcp-use SDK agentic eval — 2026-10-28

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-28T14-06-34` · batch `40702398210-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m19s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 536080 / 3706
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had some API-discovery friction before implementation: it first fetched the npm README via `npm view mcp-use readme`, then inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts` and searched implementation files using `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. This investigation established that the SDK’s native `listen()` serves the default streamable HTTP endpoint: “`The installed mcp-use SDK has a native listen() path that mounts the default /mcp endpoint`.”
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main wrong turn was dependency/API-version alignment: the first typecheck failed because the chosen Zod schema lacked the SDK-required JSON-schema support (`Property 'jsonSchema' is missing`) and left handler parameters unknown (`'a' is of type 'unknown'`). The initial server call also used the wrong signature, producing `Argument of type '{ port: number; }' is not assignable to parameter of type 'number'`, while Node typings were omitted (`Cannot find name 'process'`). The agent corrected these only after installation, explaining that it was “`aligning the dependencies and its current listen(port) API`,” which required a second `npm install`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had API-discovery friction and relied first on npm metadata/readme via `npm view mcp-use readme --json`, then inspected installed declarations with `rg -n "listen\\(" node_modules/mcp-use/dist...`. One exploratory command failed because it assumed a nonexistent declaration file: `rg: node_modules/mcp-use/dist/node.d.ts: No such file or directory`. The useful API shape was ultimately found in `node_modules/mcp-use/dist/server.d.ts`, including `listen(port?: number ...): Promise<{ ... url: string; }>`, after which the agent concluded that `MCPServer.listen()` served HTTP directly.
