# mcp-use SDK agentic eval — 2026-11-11

Run `v2-02-stateful-ticket-queue--noskill+blank--codex--2026-11-11T14-05-22` · batch `43034806780-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (1/1 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-02-stateful-ticket-queue | noskill+blank | 1/1 |

## Performance (passing trials)

- Median duration: 1m38s
- Median turns: 13
- Median tool calls: 26
- Median tokens in/out: 703646 / 6027
- Total cost: - (some trials missing cost)
- Cost per success: -

## Failure breakdown

No contract failures.

Invalid trials: 2

- `infra.agent`: 2

## SDK path

- `unknown`: 2
- `mcp-use`: 1

## Memos

- `v2-02-stateful-ticket-queue` · `noskill+blank` · trial 3 — [trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md](trials/v2-02-stateful-ticket-queue--noskill+blank--t3/memo.md): The agent had discovery friction around the SDK API and transport setup, first inspecting `node_modules/mcp-use/README.md`, then grepping declarations with `rg -n "listen\\(|streamable|http" ...` and reading `dist/config.d.ts`, `dist/tools.d.ts`, and `dist/server.d.ts`. No skill file or external docs URL appears; the main resource was the installed package’s README and type declarations.
