# mcp-use SDK agentic eval — 2026-09-02

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-02T14-07-53` · batch `33639855815-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 1m28s
- Median turns: 14
- Median tool calls: 17.5
- Median tokens in/out: 415778 / 3400.5
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 1

- `infra.agent`: 1

## SDK path

- `mcp-use`: 2
- `unknown`: 1

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent noticeable discovery effort on API shape because the npm README query yielded only package metadata and no README body: `npm view mcp-use readme | sed -n '1,220p'` produced just the version/description block. It then leaned heavily on installed-package inspection, running `find node_modules/mcp-use`, reading `node_modules/mcp-use/README.md`, and grepping declarations with `rg -n "listen\(|streamable|http" ...`; this ultimately exposed the useful contract in `node_modules/mcp-use/dist/config.d.ts`, including ``TCP port `listen()` binds`` and the default `/mcp` route.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main SDK-discovery work came from npm metadata and installed-package inspection: the agent ran `npm view mcp-use version description homepage repository.url dist.tarball --json`, then opened `node_modules/mcp-use/README.md`, `node_modules/mcp-use/dist/index.d.ts`, `node_modules/mcp-use/dist/server.d.ts`, and grepped for `listen\(` in the bundled implementation. This suggests the local README/type declarations were needed to establish the API shape; no mcp-use skill file or fetched docs page appears in the transcript, although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
