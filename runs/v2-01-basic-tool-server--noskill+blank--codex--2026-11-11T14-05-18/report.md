# mcp-use SDK agentic eval — 2026-11-11

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-11T14-05-18` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m03s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 327472 / 3436
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was API discovery. An attempt to retrieve the npm README failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, so the agent inspected installed declarations instead, including `node_modules/mcp-use/dist/server.d.ts`, `config.d.ts`, and `tools.d.ts`. That inspection surfaced the useful listener contract: `Port precedence is the argument, PORT, config.port, then 3000`, allowing the implementation to rely on `await server.listen()` rather than manually parsing `PORT`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery. An attempt to read npm metadata failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`, after which the agent downloaded and unpacked the package via `npm pack mcp-use` and searched `package/README.md` plus `package/dist/server.d.ts`. Those declarations provided the decisive examples: `inputSchema: z.object({ a: z.number(), b: z.number() })` and `await server.listen(3000);`. The README also surfaced the documentation URL `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show it being fetched; no mcp-use skill file was used.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): Discovery required inspecting the installed package because `npm view mcp-use readme --json` returned an empty string (`"output":""`). The agent then leaned on `node_modules/mcp-use/README.md` and grepped declarations with `rg -n "listen|streamable|HTTP|mount" ...`, followed by reading `dist/server.d.ts`, `dist/node-http.d.ts`, and `dist/index.d.ts` to determine the listener and `/mcp` API shape.
