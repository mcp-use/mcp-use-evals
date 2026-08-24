# mcp-use SDK agentic eval — 2026-08-24

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-24T14-16-08` · batch `32737466939-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 12
- Median tool calls: 17
- Median tokens in/out: 426592 / 3809
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent first relied on npm metadata/readme—`npm view mcp-use readme` surfaced `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`—then inspected installed declarations with `rg -n "listen\\(|serve\\(|Streamable|http" node_modules/mcp-use/...` and `sed ... node_modules/mcp-use/dist/server.d.ts` to confirm the API shape.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent relied first on npm package metadata—`npm view mcp-use version description readme --json`—and then inspected installed declarations with `rg -n "listen|serve|start|MCPServer" node_modules/mcp-use` and `sed ... node_modules/mcp-use/dist/server.d.ts`; no skill file or fetched docs URL appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had to discover the SDK shape by inspecting installed package files rather than using a skill or fetched documentation: `rg -n "streamable|Streamable|tool\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist` followed by reads of `node_modules/mcp-use/dist/server.d.ts`, `mount-mcp.d.ts`, and `config.d.ts`. This worked, but added several exploratory calls before implementation.
