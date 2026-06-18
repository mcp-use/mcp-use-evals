/**
 * Core readiness types.
 *
 * The scoring model is deliberately deterministic-anchored: a small set of
 * weighted dimensions sum to a 0–100 Readiness Score, and the LLM judge only
 * owns a small bounded slice (process quality). The judge's richer output is
 * *diagnostic* — lever-tagged findings that feed the improvement loop.
 */

/** The five "levers" — each finding maps to the kind of fix it implies. */
export type Lever = 'docs' | 'template' | 'sdk' | 'skill' | 'process';
export const LEVERS: readonly Lever[] = ['docs', 'template', 'sdk', 'skill', 'process'];

export type Severity = 'low' | 'medium' | 'high';
export type FindingSource = 'deterministic' | 'judge';

/** A single thing that went well/poorly, tagged with the lever that would fix it. */
export interface Finding {
  /** short kebab-case slug, e.g. 'legacy-factory' or 'struggled-to-find-api' */
  id: string;
  title: string;
  /** evidence: a matched line, a transcript moment, a file:loc */
  detail?: string;
  lever: Lever;
  severity: Severity;
  source: FindingSource;
}

/** One condition in the A/B matrix. `skill` and `scaffold` are independent treatments. */
export interface Variant {
  /** short agent label used in experiment names: 'cc' | 'codex' | … */
  agentLabel: string;
  /** mcp-use skill injected into the agent's context */
  skill: boolean;
  /** create-mcp-use-app scaffold injected into the workspace */
  scaffold: boolean;
}

/** Canonical condition label, e.g. 'blank-cc', 'scaffold-codex', 'skill+scaffold-cc'. */
export function variantLabel(v: Variant): string {
  const cond =
    v.skill && v.scaffold ? 'skill+scaffold' : v.skill ? 'skill' : v.scaffold ? 'scaffold' : 'blank';
  return `${cond}-${v.agentLabel}`;
}

/** One weighted component of the score. `enabled: false` ⇒ not measured (excluded from normalization). */
export interface DimensionScore {
  key: string;
  label: string;
  /** canonical points out of 100 */
  weight: number;
  enabled: boolean;
  /** 0..weight (0 when disabled) */
  earned: number;
  detail?: string;
}

export interface JudgeSummary {
  enabled: boolean;
  model?: string;
  /** 2–4 sentences: where the agent struggled and how it could have done better */
  summary?: string;
  /** 0..1, drives the (bounded) process dimension */
  processQuality?: number;
  /** recurring patterns the judge thinks should graduate into deterministic lints */
  suggestedLints?: { description: string; lever: Lever }[];
  /** set when the judge was meant to run but failed (degrades gracefully) */
  error?: string;
}

export interface ReadinessMeta {
  scenario: string;
  /** full config.agent, e.g. 'claude-code' | 'vercel-ai-gateway/codex' */
  agent: string;
  model?: string;
  variant: Variant;
  variantLabel: string;
  runIndex: number;
  durationSec?: number;
  /** build (+ functional, once the probe lands) gate */
  gatePassed: boolean;
  configVersion: string;
}

export interface ReadinessResult {
  /** 0..100, normalized over enabled dimension weight */
  score: number;
  earned: number;
  enabledWeight: number;
  dimensions: DimensionScore[];
  findings: Finding[];
  /** count of findings per lever — the improvement-loop worklist */
  levers: Record<Lever, number>;
  judge: JudgeSummary;
  meta: ReadinessMeta;
}
