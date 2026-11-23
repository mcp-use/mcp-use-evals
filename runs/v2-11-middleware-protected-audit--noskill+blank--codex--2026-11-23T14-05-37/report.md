# mcp-use SDK agentic eval — 2026-11-23

Run `v2-11-middleware-protected-audit--noskill+blank--codex--2026-11-23T14-05-37` · batch `45190184843-1` · agent: codex/gpt-5.6-terra · judge: gpt-5.6-sol · grader 2.1.0 · sandbox docker · 3 trial(s)

## Pass rate: 0% (0/3 valid scored trials)

## Matrix

| Task | Condition | Passes/Trials |
|---|---|---|
| v2-11-middleware-protected-audit | noskill+blank | 0/3 |

## pass^k

pass^3: 0% (0/1 task×condition cells all-pass, min 3 trials/cell)

## Performance (passing trials)

No passing trials.

## Failure breakdown

- `contract.calls`: 2
- `contract.resources`: 1

Invalid trials: 0

## SDK path

- `mcp-use`: 3

## Memos

- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 1 — [trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t1/memo.md): The main miss was tool response wording: `src/server.ts` returns ``text: `read record ${id}``` and ``text: `deleted record ${id}```, while the deterministic checks required `Record R-1` and `deleted R-1`. The agent’s manual calls merely confirmed its own strings—`"text":"read record r-1"` and `"text":"deleted record r-1"`—then incorrectly concluded, `The live endpoint has passed the read, denied-delete, and approved-delete calls`, so verification did not test the expected contract text or capitalization.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 2 — [trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t2/memo.md): The main miss was an output-format mismatch: `src/server.ts` returns ``text: `record ${id}` ``, while the grader expected `Record R-1`. The agent’s live check did not expose this because it invoked lowercase `"id":"r-1"` and accepted the response `"text":"record r-1"` without checking capitalization against the expected contract.
- `v2-11-middleware-protected-audit` · `noskill+blank` · trial 3 — [trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md](trials/v2-11-middleware-protected-audit--noskill+blank--t3/memo.md): The agent relied heavily on installed SDK declarations rather than a skill or external docs, grepping `node_modules/mcp-use` for `"mcp:tools/call|streamable|Streamable|addTool|resource\\("` and inspecting `dist/server.d.ts`, `dist/middleware/mcp-middleware.d.ts`, `dist/tools.d.ts`, and `dist/resources.d.ts`. This successfully clarified the middleware API, reflected in `server.use("mcp:tools/call", async (ctx, next) => {` and `return next();` in `src/server.ts`.
