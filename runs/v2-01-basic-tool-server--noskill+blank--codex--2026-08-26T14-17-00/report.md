# mcp-use SDK agentic eval — 2026-08-26

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-26T14-17-00` · batch `32979129051-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m27s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 358712 / 3912
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had discovery friction around the SDK API: after `npm view mcp-use readme --json` yielded no README content, it inspected `node_modules/mcp-use/README.md`, then searched declarations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts` and read `node_modules/mcp-use/dist/index.d.ts` and `server.d.ts` to determine registration and listener shapes. No skill file or fetched docs URL appears; the main resource was the installed package’s README and type declarations.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery: `npm view mcp-use readme --json` returned no README content, so the agent installed first and inspected package internals via `sed -n '1,260p' node_modules/mcp-use/README.md`, `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`, and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts`. It also checked dependency shape with `npm ls zod --all` and explicitly installed Zod after confirming the SDK’s transitive version: `npm install zod`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm metadata (`npm view mcp-use version description repository.url`) and attempted `npm view mcp-use readme --json`, which returned an empty `"output":""`. It then relied heavily on installed package internals, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`, including grepping for `"listen\\(|streamable|http"` to determine the transport and API shape.
