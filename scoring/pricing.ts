/**
 * Per-model token pricing for the cost estimate shown in the scorecard.
 *
 * Rates are USD per 1,000,000 tokens. EDIT these to match your account /
 * the current published rates — they are best-effort defaults, not a contract.
 * A model that isn't in this table still reports token counts; its cost shows
 * as `—` (and the scorecard lists it so you know to add a rate).
 *
 * Cost is informational only — it is NOT folded into the Readiness Score, so
 * tweaking these numbers never moves the headline.
 */

export interface ModelRates {
  /** USD / 1M input (prompt) tokens billed at full rate */
  input: number;
  /** USD / 1M output (completion, incl. reasoning) tokens */
  output: number;
  /** USD / 1M cached / cache-read input tokens. Defaults to input × 0.1. */
  cachedInput?: number;
  /** USD / 1M cache-write input tokens (Claude prompt caching). Defaults to input × 1.25. */
  cacheWrite?: number;
}

/** Keyed by the bare model id (no `provider/` prefix, no `?query`). */
export const MODEL_RATES: Record<string, ModelRates> = {
  // OpenAI GPT-5.x family (USD / 1M).
  'gpt-5.5': { input: 1.25, cachedInput: 0.125, output: 10 },
  'gpt-5.2-codex': { input: 1.25, cachedInput: 0.125, output: 10 },
  // Anthropic Claude Sonnet (USD / 1M): cache read 0.1×, cache write 1.25×.
  'claude-sonnet-4-6': { input: 3, cachedInput: 0.3, cacheWrite: 3.75, output: 15 },
  'claude-opus-4-8': { input: 15, cachedInput: 1.5, cacheWrite: 18.75, output: 75 },
};

/** Strip a `?query` suffix and any `provider/` prefix → bare model id for lookup. */
export function normalizeModelId(model: string | undefined): string | undefined {
  if (!model) return undefined;
  const bare = model.split('?')[0];
  const parts = bare.split('/');
  return parts[parts.length - 1] || undefined;
}

export function ratesFor(model: string | undefined): ModelRates | undefined {
  const id = normalizeModelId(model);
  return id ? MODEL_RATES[id] : undefined;
}
