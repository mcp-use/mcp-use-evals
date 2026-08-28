# mcp-use SDK agentic eval — 2026-08-28

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-08-28T18-02-25` · batch `33197312649-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m17s
- Median turns: 12
- Median tool calls: 16
- Median tokens in/out: 419067 / 5822
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The agent had to discover the SDK shape from the installed package rather than an available skill or scaffold: it ran `npm view mcp-use version description repository.url peerDependencies dependencies --json`, then inspected `node_modules/mcp-use/README.md`, `dist/server.d.ts`, `dist/tools.d.ts`, and grepped for `listen\(`. This worked, but reflects API-discovery friction before implementation.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): SDK discovery took several exploratory steps: `npm view mcp-use version description repository.url readme --json` returned an empty `"readme": ""`, after which the agent inspected `node_modules/mcp-use/README.md`, `dist/index.d.ts`, `dist/server.d.ts`, and `dist/node-http.d.ts`. It also grepped installed SDK internals with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`, but that command’s captured output was only `4.23.12`, so the API-shape search produced no visible useful result. The package README supplied the docs link `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but there is no visible fetch of that URL or use of a skill file.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main discovery cost was learning the SDK API directly from the installed package: the agent opened `node_modules/mcp-use/README.md`, then inspected `node_modules/mcp-use/dist/server.d.ts`, `tools.d.ts`, `config.d.ts`, and searched implementations with `rg -n "listen\\(" node_modules/mcp-use/dist/server.d.ts node_modules/mcp-use/dist/*.js`. This worked, but required several broad node_modules inspection calls before implementation; no skill file or external docs URL appears in the transcript.
