# mcp-use SDK agentic eval — 2026-10-30

Run `v2-06-project-board-composition--noskill+blank--codex--2026-10-30T14-06-37` · batch `41068660754-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 100% (2/2 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-06-project-board-composition | noskill+blank | 2/2 |

## pass^k

pass^2: 100% (1/1 task×condition cells all-pass, min 2 trials/cell)

## Performance (passing trials)

- Median duration: 2m02s
- Median turns: 19
- Median tool calls: 23.5
- Median tokens in/out: 848694.5 / 8171
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

- `v2-06-project-board-composition` · `noskill+blank` · trial 1 — [trials/v2-06-project-board-composition--noskill+blank--t1/memo.md](trials/v2-06-project-board-composition--noskill+blank--t1/memo.md): The main SDK papercut was a Zod-version mismatch: the first typecheck rejected schemas because `Property 'jsonSchema' is missing`, and handler inputs consequently became `unknown`. The agent fixed this only after explicitly installing `zod@'^4.0.0'`, then reported that “`Typechecking now passes with Zod 4, which the installed SDK expects`.” This suggests the compatible schema-library major was not obvious during initial dependency setup.
- `v2-06-project-board-composition` · `noskill+blank` · trial 3 — [trials/v2-06-project-board-composition--noskill+blank--t3/memo.md](trials/v2-06-project-board-composition--noskill+blank--t3/memo.md): The main discovery friction was SDK API shape: the agent first tried the npm README, but `npm view mcp-use readme --json` produced `SyntaxError: /tmp/mcp-use-readme.json: Unexpected end of JSON input`. It then relied heavily on installed-package inspection, including `sed -n '1,260p' node_modules/mcp-use/dist/index.d.ts`, `sed -n '1,300p' node_modules/mcp-use/dist/resources.d.ts`, and searches for `"resource\\(|listen|streamable|http"`.
