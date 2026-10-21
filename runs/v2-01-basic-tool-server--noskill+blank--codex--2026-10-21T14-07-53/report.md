# mcp-use SDK agentic eval — 2026-10-21

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-21T14-07-53` · batch `39613894467-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m17s
- Median turns: 16
- Median tool calls: 19
- Median tokens in/out: 533098 / 3628
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery cost was learning the SDK shape from package artifacts rather than prior guidance: the agent queried `npm view mcp-use exports dist.tarball`, read `node_modules/mcp-use/README.md`, and inspected `node_modules/mcp-use/dist/server.d.ts`. Its first API-search command was unproductive, returning exit code 1 with `mcp-add-server@1.0.0 . └── (empty)`, after which it explicitly installed Zod and re-opened the declarations with `npm install zod && sed -n '360,430p' node_modules/mcp-use/dist/server.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main discovery friction was documentation access: `npm view mcp-use readme --json` produced an empty file (`0 /tmp/mcp-use-readme.json`), so the agent instead grepped the installed package with `rg ... node_modules/mcp-use` and relied on `node_modules/mcp-use/README.md` plus `node_modules/mcp-use/dist/server.d.ts`. Those local files supplied the key API shapes, including `import { MCPServer } from "mcp-use"`, `server.tool(`, and `listen(port?: number | undefined, options?: ListenOptions)`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The blank directory (`total 8 ... . ..`) forced API discovery from package artifacts. The agent first queried npm with `npm view mcp-use version description repository.url dist-tags --json` and `npm view mcp-use readme`, then leaned heavily on installed-package inspection: `rg -n "Streamable|streamable|tool\\(" node_modules/mcp-use` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. This included a small dead end when it searched `node_modules/mcp-use/dist/server.js` and received `No such file or directory (os error 2)`.
