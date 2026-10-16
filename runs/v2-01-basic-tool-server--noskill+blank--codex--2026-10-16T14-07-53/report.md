# mcp-use SDK agentic eval — 2026-10-16

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-10-16T14-07-53` · batch `38913034333-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m10s
- Median turns: 14
- Median tool calls: 18
- Median tokens in/out: 465165 / 3750
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent had to discover the SDK API from the installed package rather than using a skill or fetched documentation: it inspected `node_modules/mcp-use/README.md`, then queried declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and searched for `"listen|streamable|http"`. The declaration’s guidance—`listen(port?: number ...): Promise<{ ... url: string; }>`—directly informed the eventual listener implementation.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had to discover the API from the installed package rather than the npm registry README: `npm view mcp-use readme` returned no README content, after which it searched `node_modules/mcp-use/README.md` and declarations such as `node_modules/mcp-use/dist/server.d.ts`. This paid off—the declaration explicitly documented port precedence as `the argument, PORT, config.port, then 3000`—but required several exploratory greps.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent had some API-discovery friction: after `npm view mcp-use readme --json` returned no README content, it inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/server.d.ts` and `rg -n -C 4 "listen\\(" node_modules/mcp-use/dist/...`. This ultimately exposed the useful built-in example, `await server.listen(3000);`, and the documented return type containing `url: string`.
