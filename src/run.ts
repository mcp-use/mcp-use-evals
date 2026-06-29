import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { assertAgentAuth, runHarnessAgent, type AgentRunner } from "./agent.js";
import { DEFAULT_JUDGE_MODEL } from "./graders/judge.js";
import {
  emptyReadiness,
  freePort,
  gradeReadiness,
  installedSdkVersion,
} from "./graders/readiness.js";
import { startOAuthBackend } from "./oauth-backends.js";
import { consoleSummary, renderReport } from "./report.js";
import {
  applyGolden,
  prepareWorkspace,
  skillRoot,
  snapshotWorkspace,
  type SkillTarget,
} from "./sandbox.js";
import { listTaskIds, loadTask, RESULTS_DIR, SKILL_NAME } from "./tasks.js";
import {
  ALL_VARIANTS,
  parseVariant,
  variantId,
  type LoadedTask,
  type RunResult,
  type TaskOAuth,
  type TrialResult,
  type Variant,
} from "./types.js";

const HELP = `mcp-use SDK evals (MCP-2072)

Usage: pnpm eval [options]

  --task <id>          task to run (repeatable; default: all tasks)
  --variant <id>       variant to run; repeatable. Values: skill+scaffold | skill+blank | noskill+scaffold | noskill+blank |
                       blank+docs-old | blank+docs-new | all
                       (default: noskill+blank)
  --trials <n>         trials per task×variant (default: 1; use 3 for recorded runs)
  --model <id>         agent model passed to the selected AI SDK harness (default: harness default)
  --reasoning-effort <level>
                       codex-only reasoning effort: low | medium | high
  --judge-model <id>   judge model (default: ${DEFAULT_JUDGE_MODEL} — keep pinned across runs)
  --agent <runner>     claude | codex | golden
                       (golden = copy the task's known-good solution;
                       validates the graders without burning an agent run)
  --skip-judge         skip the LLM readiness judge (required for --agent golden without ANTHROPIC_API_KEY)
  --timeout-min <n>    per-trial agent timeout in minutes (default: 20)
  --help
`;

const OLD_DOCS_URL =
  "https://docs.mcp-use.com/typescript/getting-started/welcome";
const DEFAULT_NEW_DOCS_URL =
  "http://localhost:3000/typescript/getting-started/welcome";
const NEW_DOCS_URL =
  process.env.MCP_USE_EVAL_NEW_DOCS_URL ?? DEFAULT_NEW_DOCS_URL;

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      task: { type: "string", multiple: true },
      variant: { type: "string", multiple: true },
      trials: { type: "string", default: "1" },
      model: { type: "string" },
      "reasoning-effort": { type: "string" },
      "judge-model": { type: "string", default: DEFAULT_JUDGE_MODEL },
      agent: { type: "string", default: "claude" },
      "skip-judge": { type: "boolean", default: false },
      "timeout-min": { type: "string", default: "20" },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }

  const taskIds =
    values.task && values.task.length > 0 ? values.task : await listTaskIds();
  const variantArgs = values.variant ?? ["noskill+blank"];
  const variants = parseVariants(variantArgs);
  const trialsPer = Number(values.trials);
  const agentRunner = parseAgentRunner(values.agent!);
  const reasoningEffort = parseReasoningEffort(values["reasoning-effort"]);
  if (reasoningEffort && agentRunner !== "codex") {
    throw new Error("--reasoning-effort is only supported with --agent codex");
  }
  const timeoutMs = Number(values["timeout-min"]) * 60_000;
  let judgeEnabled = !values["skip-judge"];

  if (agentRunner !== "golden") assertAgentAuth(agentRunner);
  if (judgeEnabled && !process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is required because the LLM judge is part of the default readiness score. Pass --skip-judge to run without it."
    );
  }

  const startedAt = new Date().toISOString();
  const runId = buildRunId({
    taskIds,
    variant: variantLabel(variantArgs),
    agentRunner,
    startedAt,
  });
  const runDir = join(RESULTS_DIR, runId);
  await mkdir(join(runDir, "trials"), { recursive: true });

  const run: RunResult = {
    runId,
    startedAt,
    agentRunner,
    agentModel:
      values.model ?? (agentRunner === "golden" ? "golden" : "default"),
    judgeModel: judgeEnabled ? values["judge-model"]! : "skipped",
    trials: [],
  };

  for (const taskId of taskIds) {
    const task = await loadTask(taskId);
    const taskVariants = variants.filter(
      (v) =>
        !task.config.variants || task.config.variants.includes(variantId(v))
    );
    for (const variant of taskVariants) {
      for (let trial = 1; trial <= trialsPer; trial++) {
        const label = `${taskId} · ${variantId(variant)} · trial ${trial}/${trialsPer}`;
        console.log(`\n▶ ${label}`);
        const result = await runTrial({
          task,
          variant,
          trial,
          agentRunner,
          model: values.model,
          reasoningEffort,
          judgeModel: judgeEnabled ? values["judge-model"]! : null,
          timeoutMs,
          runDir,
        });
        run.trials.push(result);
        console.log(
          `  readiness ${result.readiness.score} · functional ${result.readiness.functionalScore}${result.readiness.functionalSuccess ? " ✅" : ""} · penalties ${result.readiness.penalties.length} · judge findings ${result.readiness.judge?.findings.length ?? "—"}${result.error ? ` · ⚠️ ${result.error}` : ""}`
        );
      }
    }
  }

  await writeFile(join(runDir, "run.json"), JSON.stringify(run, null, 2));
  await writeFile(join(runDir, "report.md"), renderReport(run));
  console.log(`\n${consoleSummary(run)}`);
  console.log(`\nReport: ${join(runDir, "report.md")}`);
}

/**
 * Human-readable run directory name: what ran, then when.
 * e.g. "01-basic-tool-server--noskill+blank--2026-06-11T18-40-40",
 *      "3-tasks--all-variants--golden--2026-06-12T09-15-02"
 */
function buildRunId(opts: {
  taskIds: string[];
  variant: string;
  agentRunner: AgentRunner | "golden";
  startedAt: string;
}): string {
  const taskPart =
    opts.taskIds.length === 1
      ? opts.taskIds[0]
      : `${opts.taskIds.length}-tasks`;
  const variantPart = opts.variant === "all" ? "all-variants" : opts.variant;
  const stamp = opts.startedAt.replace(/[:.]/g, "-").slice(0, 19);
  return [
    taskPart,
    variantPart,
    ...(opts.agentRunner === "golden" || opts.agentRunner === "codex"
      ? [opts.agentRunner]
      : []),
    stamp,
  ].join("--");
}

async function runTrial(opts: {
  task: LoadedTask;
  variant: Variant;
  trial: number;
  agentRunner: AgentRunner | "golden";
  model?: string;
  reasoningEffort?: "low" | "medium" | "high";
  judgeModel: string | null;
  timeoutMs: number;
  runDir: string;
}): Promise<TrialResult> {
  const { task, variant } = opts;
  const vid = variantId(variant);
  const skillTarget = skillTargetForAgent(opts.agentRunner);
  const agentPrompt = promptForVariant(task.prompt, variant, skillTarget);
  const trialDir = join(
    opts.runDir,
    "trials",
    `${task.config.id}--${vid}--t${opts.trial}`
  );
  await mkdir(trialDir, { recursive: true });

  const base: Omit<TrialResult, "readiness"> = {
    task: task.config.id,
    variant: vid,
    trial: opts.trial,
    promptHash: hashPrompt(agentPrompt),
    agentRunner: opts.agentRunner,
    agentModel:
      opts.model ?? (opts.agentRunner === "golden" ? "golden" : "default"),
    sdkVersion: null,
    durationMs: null,
    turns: null,
    costUsd: null,
    transcriptPath: null,
    timestamp: new Date().toISOString(),
    error: null,
  };

  const sandbox = await prepareWorkspace(variant, { skillTarget }).catch(
    (err) => {
      return { error: String(err) } as const;
    }
  );
  if ("error" in sandbox) {
    return {
      ...base,
      readiness: emptyReadiness(),
      error: `sandbox: ${sandbox.error}`,
    };
  }

  let transcript = "";
  try {
    // ── agent phase ──
    if (opts.agentRunner === "golden") {
      await applyGolden(task.dir, sandbox.workspace);
    } else {
      // OAuth tasks get a live IdP for the whole agent session so the agent
      // can inspect/probe the issuer. Grading later starts its own fresh
      // instance on a different port (state isolation + catches hardcoded
      // issuer URLs).
      const agentBackend = task.config.oauth
        ? await startOAuthBackend(task.config.oauth.backend, await freePort())
        : null;
      const agentEnv = {
        ...agentEnvFromKeys(task.config.agentEnvKeys),
        ...(agentBackend
          ? agentPhaseOAuthEnv(task.config.oauth!, agentBackend.env)
          : {}),
      };
      let info;
      try {
        info = await runHarnessAgent({
          runner: opts.agentRunner,
          workspace: sandbox.workspace,
          prompt: agentPrompt,
          model: opts.model,
          reasoningEffort: opts.reasoningEffort,
          timeoutMs: opts.timeoutMs,
          extraEnv: Object.keys(agentEnv).length > 0 ? agentEnv : undefined,
        });
      } finally {
        await agentBackend?.stop();
      }
      base.durationMs = info.durationMs;
      base.turns = info.turns;
      base.costUsd = info.costUsd;
      transcript = info.transcriptMd;
      await writeFile(join(trialDir, "transcript.jsonl"), info.rawJsonl);
      await writeFile(join(trialDir, "transcript.md"), info.transcriptMd);
      base.transcriptPath = join(
        "trials",
        `${task.config.id}--${vid}--t${opts.trial}`,
        "transcript.md"
      );
    }

    // ── grading phase ──
    const readiness = await gradeReadiness({
      workspace: sandbox.workspace,
      task,
      variant: vid,
      transcript,
      turns: base.turns,
      costUsd: base.costUsd,
      durationMs: base.durationMs,
      judgeModel: opts.judgeModel,
    });
    base.sdkVersion = await installedSdkVersion(sandbox.workspace);

    await snapshotWorkspace(sandbox.workspace, join(trialDir, "workspace"));
    return {
      ...base,
      readiness,
      error: null,
    };
  } catch (err) {
    await snapshotWorkspace(
      sandbox.workspace,
      join(trialDir, "workspace")
    ).catch(() => {});
    return {
      ...base,
      readiness: emptyReadiness(),
      error: String(err instanceof Error ? (err.stack ?? err.message) : err),
    };
  } finally {
    await sandbox.cleanup().catch(() => {});
  }
}

function parseAgentRunner(value: string): AgentRunner | "golden" {
  if (value === "claude" || value === "codex" || value === "golden") {
    return value;
  }
  throw new Error(`unknown agent runner "${value}"`);
}

function parseReasoningEffort(
  value: string | undefined
): "low" | "medium" | "high" | undefined {
  if (value === undefined) return undefined;
  if (value === "low" || value === "medium" || value === "high") return value;
  throw new Error(
    `unknown reasoning effort "${value}" (expected low, medium, or high)`
  );
}

function parseVariants(ids: string[]): Variant[] {
  if (ids.includes("all")) {
    if (ids.length > 1) {
      throw new Error("--variant all cannot be combined with other variants");
    }
    return ALL_VARIANTS;
  }
  const seen = new Set<string>();
  return ids.filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map(parseVariant);
}

function variantLabel(ids: string[]): string {
  if (ids.length === 1) return ids[0]!;
  return ids.join("_");
}

function agentEnvFromKeys(keys: string[] | undefined): Record<string, string> {
  const env: Record<string, string> = {};
  for (const key of keys ?? []) {
    const value = process.env[key];
    if (value) env[key] = value;
  }
  return env;
}

function promptForVariant(
  prompt: string,
  variant: Variant,
  skillTarget: SkillTarget
): string {
  const prefix: string[] = [];

  if (variant.skill) {
    const skillPath = `${skillRoot(skillTarget)}/${SKILL_NAME}/SKILL.md`;
    prefix.push(
      `A project skill for building mcp-use servers is available at ${skillPath}.`,
      "Use that skill as the canonical implementation guide for mcp-use imports, server setup, transports, tools, resources, auth, and client verification details."
    );
  }

  if (variant.docs) {
    const docsLabel =
      variant.docs === "old"
        ? "production mcp-use TypeScript docs"
        : "preview mcp-use TypeScript docs";
    const docsUrl = variant.docs === "old" ? OLD_DOCS_URL : NEW_DOCS_URL;

    prefix.push(
      `Use the ${docsLabel} as the canonical reference while completing this task: ${docsUrl}`,
      "Prefer that documentation for mcp-use imports, server setup, transports, tools, resources, auth, and client verification details."
    );
  }

  if (prefix.length === 0) return prompt;
  return [...prefix, "", prompt].join("\n");
}

function hashPrompt(prompt: string): string {
  return createHash("sha256").update(prompt).digest("hex").slice(0, 12);
}

function skillTargetForAgent(agentRunner: AgentRunner | "golden"): SkillTarget {
  return agentRunner === "codex" ? "codex" : "claude";
}

function agentPhaseOAuthEnv(
  oauth: TaskOAuth,
  backendEnv: Record<string, string>
): Record<string, string> {
  if (oauth.backend === "clerk" && oauth.frontendApiUrl) {
    return {
      ...backendEnv,
      MCP_USE_OAUTH_CLERK_FRONTEND_API_URL: oauth.frontendApiUrl,
    };
  }
  return backendEnv;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
