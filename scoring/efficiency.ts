/**
 * Efficiency dimension: how economically the agent reached its result, vs a
 * per-scenario budget. Full credit at/under budget, linear to 0 at 2× budget.
 * Tokens aren't in the transcript summary, so we use tool calls + turns + wall time.
 */
import type { TranscriptSummary } from '@vercel/agent-eval';

export interface Budget {
  toolCalls: number;
  turns: number;
  durationSec: number;
}

export const DEFAULT_BUDGET: Budget = { toolCalls: 60, turns: 30, durationSec: 480 };

export const SCENARIO_BUDGETS: Record<string, Partial<Budget>> = {};

export function budgetFor(scenario: string): Budget {
  return { ...DEFAULT_BUDGET, ...(SCENARIO_BUDGETS[scenario] ?? {}) };
}

function metricScore(actual: number, target: number): number {
  if (target <= 0) return 1;
  const ratio = actual / target;
  return Math.max(0, Math.min(1, 1 - Math.max(0, ratio - 1)));
}

export function efficiencyScore(args: {
  summary?: TranscriptSummary;
  durationSec?: number;
  scenario: string;
}): { score01: number; detail: string } {
  const budget = budgetFor(args.scenario);
  const subs: { name: string; v: number }[] = [];

  if (args.summary) {
    subs.push({
      name: `tools ${args.summary.totalToolCalls}/${budget.toolCalls}`,
      v: metricScore(args.summary.totalToolCalls, budget.toolCalls),
    });
    subs.push({
      name: `turns ${args.summary.totalTurns}/${budget.turns}`,
      v: metricScore(args.summary.totalTurns, budget.turns),
    });
  }
  if (typeof args.durationSec === 'number' && args.durationSec > 0) {
    subs.push({
      name: `dur ${Math.round(args.durationSec)}s/${budget.durationSec}s`,
      v: metricScore(args.durationSec, budget.durationSec),
    });
  }

  if (subs.length === 0) return { score01: 0, detail: 'no efficiency signal (no transcript/duration)' };

  const score01 = subs.reduce((a, s) => a + s.v, 0) / subs.length;
  return { score01, detail: subs.map((s) => `${s.name}→${s.v.toFixed(2)}`).join(', ') };
}
