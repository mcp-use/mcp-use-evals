# mcp-use SDK agentic eval — 2026-11-25

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-25T14-05-32` · batch `45630015943-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m14s
- Median turns: 11
- Median tool calls: 16
- Median tokens in/out: 293753 / 3375
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main wrong turn was selecting an incompatible Zod release initially: typechecking failed because `Property 'jsonSchema' is missing`, which also caused callback parameters to degrade to unknown (`'a' is of type 'unknown'`). The agent corrected this by changing the dependency to `"zod": "^4.1.12"` in `package.json`, after noting that “`The current SDK expects Zod’s newer JSON-schema-capable release`.”
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had API-discovery friction: it first queried npm metadata with `npm view mcp-use version description readme --json`, then searched installed declarations using `rg -n "class MCPServer|serve\(|listen\(|Streamable|streamable" node_modules/mcp-use`, and inspected `node_modules/mcp-use/dist/server.d.ts`; no skill file or fetched documentation URL appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had API-discovery friction despite the simple task: it first queried npm with `npm view mcp-use version description readme --json`, then inspected package internals via `rg -n "listen\\(|serve\\(|Streamable|HTTP|MCPServer" node_modules/mcp-use/dist node_modules/mcp-use/README.md` and `sed -n '1,240p' node_modules/mcp-use/dist/server.d.ts`. This node_modules/type-definition inspection was the main resource used; no mcp-use skill file or fetched documentation page appears in the transcript.
