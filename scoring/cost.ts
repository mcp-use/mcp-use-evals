/**
 * Token-usage extraction + cost estimate from a parsed transcript.
 *
 * Usage isn't in the transcript summary, so we read it out of each event's raw
 * provider payload (`TranscriptEvent.raw`). The two agent families report it
 * differently:
 *   - Codex (OpenAI): one CUMULATIVE usage block on the final turn event
 *     (`raw.usage`), where `input_tokens` already INCLUDES `cached_input_tokens`.
 *   - Claude Code: PER-MESSAGE usage at `raw.message.usage`, summed across
 *     assistant messages, where `input_tokens` EXCLUDES the cache buckets
 *     (`cache_read_input_tokens` / `cache_creation_input_tokens`).
 *
 * Both reduce to the same billed quantities (full-rate input, cached input,
 * cache-write, output). Cost is informational — never part of the score.
 */
import type { Transcript } from '@vercel/agent-eval';
import type { CostSummary } from './types.js';
import { ratesFor } from './pricing.js';

interface RawUsage {
  inputTokens: number; // full-rate prompt tokens (cached subtracted out)
  cachedInputTokens: number;
  cacheWriteTokens: number;
  outputTokens: number; // incl. reasoning tokens
  reasoningOutputTokens: number;
}

type Family = 'codex' | 'claude' | 'other';

function agentFamily(agent: string): Family {
  if (/codex|gpt|openai/i.test(agent)) return 'codex';
  if (/claude|anthropic/i.test(agent)) return 'claude';
  return 'other';
}

function asRecord(v: unknown): Record<string, unknown> | undefined {
  return v && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;
}
function num(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

/** Codex: take the usage block with the largest total — the cumulative final turn. */
function extractCodex(t: Transcript): RawUsage | undefined {
  let best: RawUsage | undefined;
  let bestTotal = -1;
  for (const e of t.events) {
    const u = asRecord(asRecord(e.raw)?.usage);
    if (!u) continue;
    const input = num(u.input_tokens);
    const output = num(u.output_tokens);
    if (input + output === 0) continue;
    if (input + output > bestTotal) {
      bestTotal = input + output;
      const cached = num(u.cached_input_tokens ?? u.cache_read_input_tokens);
      best = {
        // Codex `input_tokens` is inclusive of cached → subtract to get full-rate.
        inputTokens: Math.max(0, input - cached),
        cachedInputTokens: cached,
        cacheWriteTokens: 0,
        outputTokens: output,
        reasoningOutputTokens: num(u.reasoning_output_tokens),
      };
    }
  }
  return best;
}

/** Claude Code: sum per-assistant-message usage (`raw.message.usage`, or `raw.usage`). */
function extractClaude(t: Transcript): RawUsage | undefined {
  const acc: RawUsage = {
    inputTokens: 0,
    cachedInputTokens: 0,
    cacheWriteTokens: 0,
    outputTokens: 0,
    reasoningOutputTokens: 0,
  };
  let found = false;
  for (const e of t.events) {
    const raw = asRecord(e.raw);
    const u = asRecord(raw?.message ? asRecord(raw.message)?.usage : undefined) ?? asRecord(raw?.usage);
    if (!u) continue;
    found = true;
    acc.inputTokens += num(u.input_tokens); // already excludes cache buckets
    acc.cachedInputTokens += num(u.cache_read_input_tokens ?? u.cached_input_tokens);
    acc.cacheWriteTokens += num(u.cache_creation_input_tokens);
    acc.outputTokens += num(u.output_tokens);
  }
  return found ? acc : undefined;
}

function extractUsage(transcript: Transcript, agent: string): RawUsage | undefined {
  return agentFamily(agent) === 'claude' ? extractClaude(transcript) : extractCodex(transcript);
}

function round(n: number, dp: number): number {
  const f = 10 ** dp;
  return Math.round(n * f) / f;
}

/**
 * Estimate cost for a run. Returns undefined when no usage is present in the
 * transcript (pre-usage runs / unparseable). When usage exists but the model
 * isn't priced, returns token counts with `priced: false` and no `usd`.
 */
export function computeCost(
  transcript: Transcript | undefined,
  agent: string,
  model: string | undefined,
): CostSummary | undefined {
  if (!transcript?.events?.length) return undefined;
  const usage = extractUsage(transcript, agent);
  if (!usage) return undefined;

  const rates = ratesFor(model);
  let usd: number | undefined;
  if (rates) {
    const cachedRate = rates.cachedInput ?? rates.input * 0.1;
    const cacheWriteRate = rates.cacheWrite ?? rates.input * 1.25;
    usd = round(
      (usage.inputTokens / 1e6) * rates.input +
        (usage.cachedInputTokens / 1e6) * cachedRate +
        (usage.cacheWriteTokens / 1e6) * cacheWriteRate +
        (usage.outputTokens / 1e6) * rates.output,
      4,
    );
  }

  return {
    measured: true,
    priced: Boolean(rates),
    inputTokens: usage.inputTokens,
    cachedInputTokens: usage.cachedInputTokens,
    cacheWriteTokens: usage.cacheWriteTokens || undefined,
    outputTokens: usage.outputTokens,
    reasoningOutputTokens: usage.reasoningOutputTokens || undefined,
    usd,
  };
}
