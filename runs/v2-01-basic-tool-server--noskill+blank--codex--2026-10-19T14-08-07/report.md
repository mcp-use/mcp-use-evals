# mcp-use SDK agentic eval — 2026-10-19

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-19T14-08-07` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 0m59s
- Median turns: 15
- Median tool calls: 17
- Median tokens in/out: 432134 / 3644
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent several discovery calls inspecting installed package internals rather than finding a concise usage example: it ran `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts`, searched for `listen(`, and opened `node_modules/mcp-use/dist/tools.d.ts` and `config.d.ts`. The initial registry documentation attempt, `npm view mcp-use readme --json`, produced only package metadata in the visible output, after which the agent relied on `node_modules/mcp-use/README.md` and declaration files for API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url dist.tarball`, then grepped the installed package for `"Streamable|streamable|MCPServer|createServer|server\\.tool|listen\\("`, and finally inspected `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/config.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and `node_modules/mcp-use/dist/tools.d.ts`. The README example provided the eventual tool shape, including `import { MCPServer } from "mcp-use";`, `const weatherInput = z.object(...)`, and `export const getWeather = server.tool(...)`; the listener behavior required further type-definition inspection around `Serve over HTTP on Node`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main friction was API discovery: the agent first queried npm metadata with `npm view mcp-use version description repository.url --json`, then inspected the installed package via `find node_modules/mcp-use` and read declarations including `node_modules/mcp-use/dist/server.d.ts` and `node_modules/mcp-use/dist/tools.d.ts`. No mcp-use skill file or external docs URL appears in the transcript; the implementation was derived from package-local type declarations such as `listen(port?: number | undefined, options?: ListenOptions)`.
