# mcp-use SDK agentic eval — 2026-11-13

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-11-13T14-05-16` · batch `43439194679-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m11s
- Median turns: 16
- Median tool calls: 20
- Median tokens in/out: 418916 / 3948
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery friction was documentation location: fetching the guessed repository README path failed with `curl: (22) The requested URL returned error: 404`. The agent then relied heavily on the installed package, inspecting `node_modules/mcp-use/dist/index.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/tools.d.ts`, and `node_modules/mcp-use/README.md`; the declaration search surfaced `await server.listen(3000);` and the package README linked to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main cost was API discovery: the agent queried npm (`npm view mcp-use readme --json`), fetched the repository README (`curl -fsSL https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`), then fetched an unrelated onboarding prompt (`curl -fsSL https://mcp-use.com/prompt.md`) whose content began `I'm new to Manufact. Help me connect it to this AI client`. It ultimately cloned and searched the repository (`git clone --depth 1 https://github.com/mcp-use/mcp-use.git`) rather than using a skill file; the first search assumed the wrong monorepo layout and produced `rg: /tmp/mcp-use-repo/packages: No such file or directory`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent relied on the installed package rather than external docs, inspecting `node_modules/mcp-use/README.md`, grepping `node_modules/mcp-use/dist/*.d.ts` for `"listen\\(|streamable|http"`, and reading `server.d.ts`, `config.d.ts`, and `tools.d.ts` to discover the API shape.
