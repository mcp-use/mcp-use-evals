import type { TrialPerf } from "../types.js";

/**
 * Derive performance metrics from the harness-stream transcript
 * (`transcript.jsonl`, written by `runHarnessAgent` in `src/agent.ts`):
 * `tool-call` events are counted for `toolCalls`, and the final `result`
 * event's `total_usage` supplies token counts. Performance is reported
 * beside correctness and never affects `contractPass` — so this function is
 * defensive by design: a missing or malformed transcript yields nulls, it
 * never throws.
 */
export function perfFromRun(opts: {
  rawJsonl: string | null;
  durationMs: number | null;
  turns: number | null;
  costUsd: number | null;
}): TrialPerf {
  const perf: TrialPerf = {
    durationMs: opts.durationMs,
    turns: opts.turns,
    tokensIn: null,
    tokensOut: null,
    toolCalls: null,
    costUsd: opts.costUsd,
  };
  if (!opts.rawJsonl) return perf;

  let toolCalls = 0;
  let sawAnyLine = false;
  for (const line of opts.rawJsonl.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(trimmed) as Record<string, unknown>;
    } catch {
      continue;
    }
    sawAnyLine = true;

    if (event.type === "tool-call") {
      toolCalls++;
      continue;
    }
    if (event.type !== "result") continue;

    const usage = event.total_usage;
    if (!usage || typeof usage !== "object") continue;
    const u = usage as Record<string, unknown>;
    if (typeof u.inputTokens === "number") perf.tokensIn = u.inputTokens;
    if (typeof u.outputTokens === "number") perf.tokensOut = u.outputTokens;
    // Usage blocks don't carry cost in practice today, but be defensive in
    // case a future harness reports it — prefer that over the passed-through
    // value when present.
    if (typeof u.costUsd === "number") perf.costUsd = u.costUsd;
  }

  if (sawAnyLine) perf.toolCalls = toolCalls;
  return perf;
}
