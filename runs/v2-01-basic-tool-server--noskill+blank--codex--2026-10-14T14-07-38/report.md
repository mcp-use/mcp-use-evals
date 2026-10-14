# mcp-use SDK agentic eval — 2026-10-14

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-14T14-07-38` · batch `38577503095-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m05s
- Median turns: 12
- Median tool calls: 15
- Median tokens in/out: 307716 / 3295
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had discovery friction around the SDK API: it first queried npm metadata with `npm view mcp-use version description repository.url dist.tarball --json && npm view mcp-use readme --json`, then inspected the installed package via `sed -n '1,240p' node_modules/mcp-use/README.md`, and finally grepped declarations with `rg -n "listen|HTTP|streamable|serve|MCPServer|mount" ...` plus direct reads of `server.d.ts`, `config.d.ts`, and `tools.d.ts`. No skill file or external docs URL was used; the effective resource was the installed package’s README and type declarations.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was documentation discovery: the agent first tried `npm view mcp-use readme --json`, but parsing failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`; a plain `npm view mcp-use readme` then returned empty output (`"output":""`). It recovered by inspecting the installed package directly, reading `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, and `node_modules/mcp-use/dist/server.d.ts`, then grepping for the listener API with `rg -n "listen\\(" ...`; the declarations exposed `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had discovery friction because npm metadata provided no README content (`"readme": ""`), so it inspected installed SDK declarations directly with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.d.ts` to determine the API shape. No mcp-use skill file or fetched docs URL appears; the explicit resource used was `node_modules/mcp-use/README.md` plus the package’s `.d.ts` files.
