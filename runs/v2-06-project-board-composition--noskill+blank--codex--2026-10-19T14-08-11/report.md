# mcp-use SDK agentic eval — 2026-10-19

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-19T14-08-11` · batch `39265955120-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 18
- Median tool calls: 25
- Median tokens in/out: 708339 / 6921
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): API discovery took several steps because `npm view mcp-use readme` produced an empty file: `0 /tmp/mcp-use-readme.json`. The agent then relied on installed package artifacts, inspecting `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, and `resources.d.ts`; it explicitly concluded that the API “`supports typed tools, static resources, resource templates, and HTTP listening`.” Client-side verification similarly required grepping dependency declarations for `StreamableHTTPClientTransport`, `readResource`, and `callTool`.
- `v2-06-project-board-composition` · `noskill+blank` · trial 2 — [trials/v2-06-project-board-composition--noskill+blank--t2/memo.md](trials/v2-06-project-board-composition--noskill+blank--t2/memo.md): The main time sink was SDK API discovery: the agent explicitly said it would “`verify the SDK’s HTTP/resource APIs against the installed package`” and then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/resources.d.ts`, `dist/config.d.ts`, and `dist/tools.d.ts`, including an `rg` search for “`listen\(|server\.resource\(|resourceTemplate`”. No skill file or external docs URL appears; the run relied on the installed README and declaration files.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The agent spent discovery time querying npm and inspecting installed SDK internals rather than using external docs: `npm view mcp-use version description repository.url dist.tarball --json`, followed by `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `resources.d.ts`. This worked, but indicates API-shape discovery depended on declaration-file grepping.
