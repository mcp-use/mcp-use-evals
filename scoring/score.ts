/**
 * The score engine: combine the deterministic dimensions + the bounded judge
 * into a 0–100 Readiness Score, normalized over the dimensions actually measured.
 *
 * Canonical weights (out of 100):
 *   build 25 · functional 40 · apiCorrectness 20 · efficiency 10 · process 5
 *
 * `functional` (the MCP-client probe) is wired but DISABLED until the probe lands,
 * so today's score normalizes over {build, apiCorrectness, efficiency, process}.
 * The `dimensions` array records exactly what was enabled (with `configVersion`)
 * so trends only ever compare like-for-like.
 */
import type { EvalFixture, EvalRunData, Transcript } from '@vercel/agent-eval';
import { parseTranscript } from '@vercel/agent-eval';
import type { DimensionScore, Finding, JudgeSummary, ReadinessResult, Variant } from './types.js';
import { variantLabel } from './types.js';
import { buildSourceBundle } from './source.js';
import { runLints, type LintContext } from './lints.js';
import { SEVERITY_DEDUCTION } from './criteria.js';
import { efficiencyScore } from './efficiency.js';
import { tallyLevers } from './levers.js';
import { runJudge } from './judge.js';

export const CONFIG_VERSION = 'readiness-v0.1';

const WEIGHTS = { build: 25, functional: 40, apiCorrectness: 20, efficiency: 10, process: 5 } as const;

export interface ScoreInput {
  fixture: EvalFixture;
  config: { agent: string; model?: string | string[] };
  runData: EvalRunData;
  runIndex: number;
  variant: Variant;
}

function detectOAuth(scenario: string, prompt: string): boolean {
  return /oauth|oidc|jwks|clerk/i.test(scenario) || /oauth|oidc|jwks/i.test(prompt);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export async function scoreRun(input: ScoreInput): Promise<ReadinessResult> {
  const { fixture, config, runData, runIndex, variant } = input;
  const scenario = fixture.name;
  const durationSec = runData.result.duration;
  const buildPassed = runData.result.status === 'passed';

  // --- transcript (best-effort) ---
  let transcript: Transcript | undefined;
  try {
    if (runData.transcript) transcript = parseTranscript(runData.transcript, config.agent);
  } catch {
    /* unparseable transcript — judge/efficiency degrade */
  }

  // --- source + deterministic lints ---
  const source = buildSourceBundle(runData.generatedFiles);
  const usesOAuth = detectOAuth(scenario, fixture.prompt);
  const lintCtx: LintContext = { source, scenario, usesOAuth };
  const deterministicFindings = runLints(lintCtx);

  // --- dimensions ---
  const dimensions: DimensionScore[] = [];

  // build (gate)
  dimensions.push({
    key: 'build',
    label: 'Builds & typechecks',
    weight: WEIGHTS.build,
    enabled: true,
    earned: buildPassed ? WEIGHTS.build : 0,
    detail: buildPassed
      ? 'npm run build passed'
      : runData.result.error
        ? `failed: ${runData.result.error}`
        : 'build/typecheck failed',
  });

  // functional — MCP-client probe, not wired yet
  dimensions.push({
    key: 'functional',
    label: 'Functional (MCP-client probe)',
    weight: WEIGHTS.functional,
    enabled: false,
    earned: 0,
    detail: 'probe not wired yet',
  });

  // api correctness (start at full, deduct per fired lint)
  const deduction = deterministicFindings.reduce((a, f) => a + SEVERITY_DEDUCTION[f.severity], 0);
  const apiEarned = Math.max(0, WEIGHTS.apiCorrectness - deduction);
  dimensions.push({
    key: 'apiCorrectness',
    label: 'API correctness',
    weight: WEIGHTS.apiCorrectness,
    enabled: true,
    earned: apiEarned,
    detail: deterministicFindings.length
      ? `${deterministicFindings.length} lint(s): ${deterministicFindings.map((f) => f.id).join(', ')}`
      : 'no API-misuse lints fired',
  });

  // efficiency
  const eff = efficiencyScore({ summary: transcript?.summary, durationSec, scenario });
  dimensions.push({
    key: 'efficiency',
    label: 'Efficiency',
    weight: WEIGHTS.efficiency,
    enabled: true,
    earned: eff.score01 * WEIGHTS.efficiency,
    detail: eff.detail,
  });

  // process (bounded judge)
  const findings: Finding[] = [...deterministicFindings];
  let judge: JudgeSummary;
  const judgeRes = await runJudge({
    scenario,
    prompt: fixture.prompt,
    agent: config.agent,
    transcript,
    serverFiles: source.serverFiles,
    deterministicFindings,
  });
  if (judgeRes.output) {
    for (const f of judgeRes.output.findings) {
      findings.push({
        id: f.id,
        title: f.title,
        detail: f.detail,
        lever: f.lever,
        severity: f.severity,
        source: 'judge',
      });
    }
    dimensions.push({
      key: 'process',
      label: 'Process quality (judge)',
      weight: WEIGHTS.process,
      enabled: true,
      earned: judgeRes.output.processQuality * WEIGHTS.process,
      detail: judgeRes.output.summary,
    });
    judge = {
      enabled: true,
      model: judgeRes.model,
      summary: judgeRes.output.summary,
      processQuality: judgeRes.output.processQuality,
      suggestedLints: judgeRes.output.suggestedLints,
    };
  } else {
    dimensions.push({
      key: 'process',
      label: 'Process quality (judge)',
      weight: WEIGHTS.process,
      enabled: false,
      earned: 0,
      detail: judgeRes.error,
    });
    judge = { enabled: false, model: judgeRes.model, error: judgeRes.error };
  }

  // --- normalize over enabled dimensions ---
  const enabled = dimensions.filter((d) => d.enabled);
  const enabledWeight = enabled.reduce((a, d) => a + d.weight, 0);
  const earned = enabled.reduce((a, d) => a + d.earned, 0);
  const score = enabledWeight > 0 ? Math.round((earned / enabledWeight) * 100) : 0;

  return {
    score,
    earned: round2(earned),
    enabledWeight,
    dimensions,
    findings,
    levers: tallyLevers(findings),
    judge,
    meta: {
      scenario,
      agent: config.agent,
      model: typeof config.model === 'string' ? config.model : undefined,
      variant,
      variantLabel: variantLabel(variant),
      runIndex,
      durationSec,
      gatePassed: buildPassed,
      configVersion: CONFIG_VERSION,
    },
  };
}
