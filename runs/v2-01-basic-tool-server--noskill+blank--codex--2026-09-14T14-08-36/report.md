# mcp-use SDK agentic eval — 2026-09-14

Run `v2-01-basic-tool-server--noskill+blank--codex--2026-09-14T14-08-36` · batch `34853463343-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-01-basic-tool-server | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 1m36s
- Median turns: 14
- Median tool calls: 19
- Median tokens in/out: 492448 / 4730
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-01-basic-tool-server` · `noskill+blank` · trial 1 — [trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t1/memo.md): The agent spent substantial discovery effort because the blank workspace offered no SDK guidance. It queried npm—`npm view mcp-use version description repository.url homepage dist.tarball`—read the package README, fetched `https://mcp-use.com/prompt.md`, and inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts`. The fetched prompt was poorly matched to this small local-server task, steering toward deployment and scaffolding: `Build and deploy an MCP app to Manufact Cloud for me` and `npx -y create-mcp-use-app@latest my-mcp-app --template mcp-apps`. The agent appropriately did not follow that advice.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 2 — [trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t2/memo.md): The agent had API-discovery friction on a blank workspace. It first pulled npm metadata and the package README via `npm view mcp-use readme`, which pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, then inspected installed declarations with `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts` and `rg -n "listen\(|PORT|basePath" node_modules/mcp-use/dist`. One inspection command took a wrong turn and exited 2 because it requested a nonexistent internal declaration: `sed -n '1,260p' node_modules/mcp-use/dist/internal/node-http.d.ts`. It later dug into bundled runtime code with `rg -o "async listen..." node_modules/mcp-use/dist/index-node.js`, suggesting the public README/declarations did not immediately settle runtime behavior.
- `v2-01-basic-tool-server` · `noskill+blank` · trial 3 — [trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md](trials/v2-01-basic-tool-server--noskill+blank--t3/memo.md): The agent spent time discovering the SDK shape locally, first grepping `node_modules/mcp-use/README.md` and declarations for `"streamable|http|new MCP|MCPServer|create.*server|tool\\("`, then reading `node_modules/mcp-use/dist/server.d.ts`, `node-bridge.d.ts`, and `tools.d.ts`. The README quickstart supplied the eventual pattern: `import { MCPServer } from "mcp-use"` and `server.tool(...)`; no skill file or fetched docs URL appears in the transcript.
