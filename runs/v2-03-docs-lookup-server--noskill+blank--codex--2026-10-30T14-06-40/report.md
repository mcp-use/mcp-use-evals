# mcp-use SDK agentic eval — 2026-10-30

Run `v2-03-docs-lookup-server--noskill+blank--codex--2026-10-30T14-06-40` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-03-docs-lookup-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m42s
- Median turns: 16
- Median tool calls: 23
- Median tokens in/out: 698374 / 6005
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-03-docs-lookup-server` · `noskill+blank` · trial 1 — [trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t1/memo.md): The agent had some SDK discovery friction: it first queried npm metadata with `npm view mcp-use readme`, then inspected the installed package via `sed -n '1,220p' node_modules/mcp-use/README.md` and grepped declarations with `sed -n '1,320p' node_modules/mcp-use/dist/server.d.ts` and `rg -n "resource\\(|listen\\(|http"`. No mcp-use skill file or external docs URL was used.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 2 — [trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t2/memo.md): The agent had notable API-discovery friction and relied heavily on installed package internals rather than a skill file or fetched docs: it ran `sed -n '1,240p' node_modules/mcp-use/README.md`, then searched declarations with `rg -n "listen\\(|start\\(|streamable|resource\\(" node_modules/mcp-use/README.md node_modules/mcp-use/dist/*.d.ts` and inspected `server.d.ts`, `resources.d.ts`, and `tools.d.ts`. This exploration did lead to the correct native APIs, summarized as: `The SDK provides native typed tools, static resources, and URI-template resources`.
- `v2-03-docs-lookup-server` · `noskill+blank` · trial 3 — [trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md](trials/v2-03-docs-lookup-server--noskill+blank--t3/memo.md): The main friction was SDK/API discovery. The agent first tried the npm README, but parsing failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then unpacked the package and inspected shipped documentation/types via `npm pack mcp-use@2.12.2` and `sed -n '1,300p' /tmp/mcp-use-inspect-212/package/README.md`, plus `dist/server.d.ts`, `dist/index.d.ts`, and `dist/resources.d.ts`; no skill file or fetched docs URL appears in the transcript.
