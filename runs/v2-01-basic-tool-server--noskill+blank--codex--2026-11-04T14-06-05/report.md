# mcp-use SDK agentic eval — 2026-11-04

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-04T14-06-05` · batch `41843935975-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 13
- Median tool calls: 17
- Median tokens in/out: 407855 / 3832
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main friction was SDK discovery. The agent first queried npm metadata, but README retrieval failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`; a second attempt, `npm view mcp-use readme`, returned no output. It then used `npm pack mcp-use --dry-run --json` to inspect package contents before installing.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main discovery friction was package documentation: fetching the npm README as JSON failed with `Unexpected end of JSON input`, and `npm view mcp-use readme | head -120` produced no output. The agent then relied on installed package artifacts, inspecting `node_modules/mcp-use/README.md` and grepping declarations with `rg -n "listen\\(|streamable|Streamable|createServer|node:http|MCPServer" ...`; this revealed the built-in `MCPServer.listen()` API and streamable HTTP behavior.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had some initial workspace-discovery friction: its first command ended with `fatal: not a git repository (or any of the parent directories): .git`, and because it chained `pwd && rg ... && git status`, the failed Git check made the overall probe report failure.
