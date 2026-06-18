/**
 * Experiment factory for the A/B matrix. Each experiments/<variant>.ts file is a
 * one-liner that calls defineExperiment(); this wires the readiness hook and the
 * skill/scaffold injectors so every variant is consistent.
 *
 * Lives outside experiments/ on purpose — agent-eval treats every file in
 * experiments/ as a runnable experiment.
 */
import type { AgentType, ExperimentConfig, Sandbox } from '@vercel/agent-eval';
import type { Variant } from './types.js';
import { createReadinessHook } from './hook.js';
import { injectScaffold, injectSkill, SKILL_PROMPT_PREFIX } from './injectors.js';

export interface DefineExperimentOptions {
  /** full agent-eval agent id, e.g. 'claude-code' | 'codex' | 'vercel-ai-gateway/codex' */
  agent: AgentType;
  /** short label used in experiment/variant names, e.g. 'cc' | 'codex' */
  agentLabel: string;
  /** inject the mcp-use skill */
  skill: boolean;
  /** inject the create-mcp-use-app scaffold */
  scaffold: boolean;
  /** trials per scenario (default 1) */
  runs?: number;
  /** per-run timeout in seconds (default 600) */
  timeout?: number;
  /** optional model override (else the agent's native default) */
  model?: string | string[];
}

export function defineExperiment(o: DefineExperimentOptions): ExperimentConfig {
  const variant: Variant = { agentLabel: o.agentLabel, skill: o.skill, scaffold: o.scaffold };

  const setups: Array<(s: Sandbox) => Promise<void>> = [];
  if (o.scaffold) setups.push(injectScaffold);
  if (o.skill) setups.push(injectSkill);

  const config: ExperimentConfig = {
    agent: o.agent,
    sandbox: 'docker',
    runs: o.runs ?? 1,
    earlyExit: false, // run every trial — we want the distribution, not first-success
    scripts: ['build'],
    timeout: o.timeout ?? 600,
    copyFiles: 'changed', // persist the agent's files into results/ as artifacts
    onRunComplete: createReadinessHook({ variant }),
  };

  if (o.model) config.model = o.model;
  if (setups.length > 0) {
    config.setup = async (sandbox) => {
      for (const s of setups) await s(sandbox);
    };
  }
  if (o.skill) {
    config.editPrompt = (prompt) => `${SKILL_PROMPT_PREFIX}\n\n${prompt}`;
  }

  return config;
}
