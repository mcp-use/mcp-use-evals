/**
 * onRunComplete hook: scores a finished run and attaches the result to
 * `result.analysis.readiness` (persisted into each run's result.json). It NEVER throws —
 * agent-eval marks a run failed if onRunComplete throws, so all errors are caught
 * and recorded as `result.analysis.readinessError` instead.
 */
import type { RunCompleteHook } from '@vercel/agent-eval';
import type { Variant } from './types.js';
import { scoreRun } from './score.js';

export interface ReadinessHookOptions {
  variant: Variant;
}

export function createReadinessHook(opts: ReadinessHookOptions): RunCompleteHook {
  return async ({ fixture, runIndex, config, runData }) => {
    try {
      const readiness = await scoreRun({ fixture, config, runData, runIndex, variant: opts.variant });
      return {
        ...runData,
        result: {
          ...runData.result,
          analysis: { ...(runData.result.analysis ?? {}), readiness },
          metadata: {
            ...(runData.result.metadata ?? {}),
            readinessScore: readiness.score,
            readinessGate: readiness.meta.gatePassed,
            variant: readiness.meta.variantLabel,
          },
        },
      };
    } catch (err) {
      return {
        ...runData,
        result: {
          ...runData.result,
          analysis: {
            ...(runData.result.analysis ?? {}),
            readinessError: err instanceof Error ? err.message : String(err),
          },
        },
      };
    }
  };
}
