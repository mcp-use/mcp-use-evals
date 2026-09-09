# mcp-use SDK agentic eval — 2026-09-09

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-09T14-07-39` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m37s
- Median turns: 13
- Median tool calls: 16
- Median tokens in/out: 478324 / 4199
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The main discovery friction was that npm metadata did not expose usable documentation: `npm view mcp-use readme --json` returned `""`. The agent compensated by inspecting the installed package directly, running `rg -n "class MCPServer|listen\(|httpStream|streamable" node_modules/mcp-use` and reading `node_modules/mcp-use/dist/server.d.ts`, `node_modules/mcp-use/dist/config.d.ts`, and `node_modules/mcp-use/README.md`; no skill file or fetched docs URL appears in the transcript.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): Before coding, the agent spent several calls discovering the API from package metadata, the bundled README, and declarations: `npm view mcp-use version description repository.url dist-tags --json`, `sed -n '120,280p' node_modules/mcp-use/README.md`, and `sed -n '340,385p' node_modules/mcp-use/dist/server.d.ts`. It did not visibly use an mcp-use skill file or fetch the linked documentation; the README only exposed `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): Discovery took several steps because `npm view mcp-use readme` returned an empty `output`, so the agent fetched the GitHub README with `curl -fsSL https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md` and then `https://mcp-use.com/prompt.md`. The latter mainly prescribed scaffolding and deployment—`you should always use npx -y create-mcp-use-app@latest {name} --template mcp-apps`—which was not directly suited to the blank, current-directory task.
