# mcp-use SDK agentic eval — 2026-08-05

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-08-05T14-50-14` · batch `31016975928-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m20s
- Median turns: 14
- Median tool calls: 20
- Median tokens in/out: 503227 / 3808
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): Discovery consumed several failed steps before the SDK shape was found locally. Fetching npm’s README as JSON failed with `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. The agent then ran `npm pack mcp-use@2.0.4 --dry-run`, but immediately tried to extract a tarball that dry-run had not created, yielding `tar: mcp-use-2.0.4.tgz: Cannot open: No such file or directory`. It ultimately leaned on the installed SDK’s README and declaration files via `sed -n '1,280p' node_modules/mcp-use/README.md` and searches such as `rg -n -A80 -B10 'listen\\(' node_modules/mcp-use/dist/server.d.ts`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The main discovery cost was API-shape research rather than implementation: the agent first queried npm with `npm view mcp-use readme`, then downloaded and unpacked the tarball via `curl -LfsS "$TARBALL"` and inspected `/tmp/mcp-use-pkg/README.md`, `/tmp/mcp-use-pkg/dist/server.d.ts`, and `/tmp/mcp-use-pkg/dist/tools.d.ts`. This suggests the package README/type declarations were the primary resources; no skill file or fetched docs page appears in the transcript, although the README exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The main discovery cost was determining the SDK API from the installed package rather than usable npm README output: `npm view mcp-use readme --json` returned no README content, after which the agent inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/server.d.ts`, `dist/node-http.d.ts`, and searched `rg -n "listen\\(" node_modules/mcp-use/dist/...`. This required three separate node_modules-inspection calls before implementation.
