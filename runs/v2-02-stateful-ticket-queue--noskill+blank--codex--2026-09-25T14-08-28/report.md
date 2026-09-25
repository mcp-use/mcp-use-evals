# mcp-use SDK agentic eval — 2026-09-25

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-09-25T14-08-28` · batch `36145323366-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (3/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 3/3 |

## pass^k

pass^3: 100% (1/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 2m32s
- Median turns: 16
- Median tool calls: 36
- Median tokens in/out: 1002398 / 7557
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 1 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t1/memo.md): The main discovery friction was package documentation access: `npm view mcp-use readme --json` produced `Unexpected end of JSON input`, and the plain fallback `npm view mcp-use readme | head -300` returned an empty `output`. The agent then worked around this by downloading and inspecting the package itself via `npm pack mcp-use@2.7.0` and extracting `package/README.md`, `package/dist/server.d.ts`, and `package/dist/node-http.d.ts`; the extracted README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched. No mcp-use skill file was used; the initial search only ran `find . -maxdepth 2 -name AGENTS.md -print` and returned no such resource.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 2 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t2/memo.md): API discovery took several exploratory steps: the agent fetched the GitHub README with `curl ... https://raw.githubusercontent.com/mcp-use/mcp-use/main/README.md`, then grepped the installed package using `rg -n "class MCPServer|listen\(|streamable|httpStream|transport" node_modules/mcp-use...`, and finally inspected `node_modules/mcp-use/dist/server.d.ts` and related declarations to confirm `listen(port)` and tool APIs. This suggests the package’s immediately available npm metadata/readme did not provide enough concrete server setup detail; `npm view mcp-use readme --json` produced no visible readme content in the result.
- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The main discovery friction was SDK API lookup: the agent first queried npm metadata with `npm view mcp-use version description repository.url`, then its README extraction failed with `Unexpected end of JSON input`. It recovered by downloading and inspecting the package tarball via `npm pack mcp-use --silent` and reading bundled declarations such as `package/dist/server.d.ts` and `package/dist/tools.d.ts`; the bundled README pointed to `https://docs.mcp-use.com/v2/typescript/getting-started/welcome`, but the transcript does not show that URL being fetched.
