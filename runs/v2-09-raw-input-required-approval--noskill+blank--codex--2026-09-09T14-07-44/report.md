# mcp-use SDK agentic eval — 2026-09-09

Run `v2-09-raw-input-required-approval--noskill+blank--codex--2026-09-09T14-07-44` · batch `34361353268-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 33% (1/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-09-raw-input-required-approval | noskill+blank | 1/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

- Median duration: 3m40s
- Median turns: 34
- Median tool calls: 39
- Median tokens in/out: 2166615 / 10938
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

- `contract.calls`: 2

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 1 — [trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t1/memo.md): The agent relied heavily on installed-package inspection rather than docs or a skill file, first grepping `node_modules` with `rg -n -C 3 'inputRequired|inputResponse|acceptedContent|streamable|http' node_modules/mcp-use/dist node_modules/mcp-use/README.md`, then drilling into declaration files such as `node_modules/@modelcontextprotocol/server/dist/createMcpHandler-CLhGwQTn.d.mts`. This discovery produced the needed API semantics, including the declaration text: “`Responses are not validated against it — pass the same schema to acceptedContent()`”.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 2 — [trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t2/memo.md): The decisive miss was semantic rather than structural: the decline branch returned `src/server.ts: "Production deployment was not approved."`, while the grader expected text containing `decline`; the neighboring `approve: false` branch already used `src/server.ts: "Deployment was declined."`. The agent’s own live verification accepted the weaker condition—`decline returns a complete \`isError\` result with no new form`—so it never checked the terminal error’s wording despite the explicit verification requirement.
- `v2-09-raw-input-required-approval` · `noskill+blank` · trial 3 — [trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md](trials/v2-09-raw-input-required-approval--noskill+blank--t3/memo.md): The decisive miss was wording rather than flow control: the decline branch returns `terminalError("Deployment was not approved.")` in `src/server.ts`, while the grader reports that this “did not match `{"type":"contains","value":"decline"}`.” The agent’s own verification showed the same response — `"text":"Deployment was not approved."` — but it concluded that the declined path was verified, so the test checked terminality without checking expected semantic wording. The nearby `approve: false` branch did use `terminalError("Deployment was declined.")`, making the inconsistent decline messages an avoidable papercut.
