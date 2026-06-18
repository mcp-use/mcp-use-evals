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
import { injectScaffold, injectSkill, skillPromptPrefix } from './injectors.js';

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
  /** per-run timeout in seconds (default 1200) */
  timeout?: number;
  /** optional model override (else the agent's native default) */
  model?: string | string[];
}

export function defineExperiment(o: DefineExperimentOptions): ExperimentConfig {
  const variant: Variant = { agentLabel: o.agentLabel, skill: o.skill, scaffold: o.scaffold };

  const setups: Array<(s: Sandbox) => Promise<void>> = [];
  // Scaffold first, then skill: the scaffold overlays the whole workspace, so the
  // skill must land afterwards or it'd be clobbered.
  if (o.scaffold) setups.push(injectScaffold);
  if (o.skill) setups.push((s) => injectSkill(s, o.agentLabel));

  const config: ExperimentConfig = {
    agent: o.agent,
    sandbox: 'docker',
    runs: o.runs ?? 1,
    earlyExit: false, // run every trial — we want the distribution, not first-success
    scripts: ['build'],
    timeout: o.timeout ?? 1200,
    copyFiles: 'changed', // persist the agent's files into results/ as artifacts
    onRunComplete: createReadinessHook({ variant }),
  };

  // Pin the model per agent family so runs are reproducible and don't silently
  // fall back to the agents' native defaults (claude-code → opus, codex →
  // gpt-5.2-codex). A variant can still override via `model`. Routing here is
  // direct (ANTHROPIC_API_KEY / OPENAI_API_KEY), so ids are unprefixed.
  //
  // No `?reasoningEffort=` query param: agent-eval bakes the model string into
  // the results artifact path (results/<variant>/<model>/…), and `?` is an
  // illegal filename char that actions/upload-artifact rejects. Codex already
  // defaults reasoning effort (and verbosity) to "medium", so bare `gpt-5.5` is
  // equivalent to `gpt-5.5?reasoningEffort=medium` without poisoning the path.
  const DEFAULT_MODEL: Record<string, string> = {
    'claude-code': 'claude-sonnet-4-6',
    codex: 'gpt-5.5',
  };
  const model = o.model ?? DEFAULT_MODEL[o.agent];
  if (model) config.model = model;

  // Scenario filtering. The agent-eval CLI has no scenario-filter flag — the only
  // hook is config.evals (string | string[] | filter fn; default '*' = all),
  // resolved by the harness's resolveEvalNames (exact name, glob, or array). We
  // read EVAL_FILTER so the CI workflow (and ad-hoc runs) can scope scenarios
  // without editing each variant file. Unset / empty / 'all' → leave config.evals
  // unset → run every scenario (current behavior). A comma/space-separated list
  // becomes an array; a lone name or glob (e.g. 'stormdesk-*') passes through.
  const evalFilter = process.env.EVAL_FILTER?.trim();
  if (evalFilter && evalFilter.toLowerCase() !== 'all') {
    const names = evalFilter
      .split(/[\s,]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    config.evals = names.length === 1 ? names[0] : names;
  }

  if (setups.length > 0) {
    config.setup = async (sandbox) => {
      for (const s of setups) await s(sandbox);
    };
  }
  if (o.skill) {
    const prefix = skillPromptPrefix(o.agentLabel);
    config.editPrompt = (prompt) => `${prefix}\n\n${prompt}`;
  }

  return config;
}
