import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { parseArgs } from "node:util";
import {
  assertAgentAuth,
  resolveAgentDefaults,
  runHarnessAgent,
  type AgentRunner,
} from "./agent.js";
import { freePort, gradeWorkspace, installedSdkVersion } from "./graders/functional.js";
import { DEFAULT_JUDGE_MODEL, writeMemo } from "./graders/judge.js";
import { perfFromRun } from "./graders/perf.js";
import { startOAuthBackend } from "./oauth-backends.js";
import { consoleSummary, renderReport } from "./report.js";
import {
  prepareWorkspace,
  skillRoot,
  snapshotWorkspace,
  type SkillTarget,
} from "./sandbox.js";
import {
  listTaskIds,
  loadTask,
  RESULTS_DIR,
  SKILL_DIR,
  SKILL_NAME,
} from "./tasks.js";
import {
  ALL_VARIANTS,
  GRADER_VERSION,
  parseVariant,
  variantId,
  type FailureCode,
  type LoadedTask,
  type RunResult,
  type TaskOAuth,
  type TrialGrade,
  type TrialPerf,
  type TrialResult,
  type Variant,
} from "./types.js";

const HELP = `mcp-use SDK evals (MCP-2072)

Usage: pnpm eval [options]

  --task <id>          task to run (repeatable; default: all tasks)
  --condition <id>     condition to run; repeatable. Values: skill+scaffold | skill+blank | noskill+scaffold | noskill+blank |
                       all
                       (default: noskill+blank)
  --variant <id>       deprecated alias for --condition
  --trials <n>         trials per task×condition (default: 1; use 3 for recorded runs)
  --batch-id <id>      groups sharded runs into one evaluation batch (default: this run's id)
  --model <id>         agent model passed to the selected AI SDK harness
                       (default: claude → claude-sonnet-5, codex → gpt-5.6-terra — pinned for trend stability)
  --reasoning-effort <level>
                       codex-only reasoning effort: low | medium | high (default: high)
  --judge-model <id>   judge model (default: ${DEFAULT_JUDGE_MODEL} — keep pinned across runs)
  --agent <runner>     claude | codex
  --skip-judge         skip the LLM memo (the judge is unscored — this only saves time/cost)
  --timeout-min <n>    per-trial agent timeout in minutes (default: 20)
  --help
`;

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      task: { type: "string", multiple: true },
      condition: { type: "string", multiple: true },
      variant: { type: "string", multiple: true },
      trials: { type: "string", default: "1" },
      "batch-id": { type: "string" },
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
  if (values.condition && values.variant) {
    throw new Error("Use either --condition or --variant, not both");
  }
  const conditionArgs = values.condition ?? values.variant ?? ["noskill+blank"];
  const variants = parseVariants(conditionArgs);
  const trialsPer = Number(values.trials);
  const agentRunner = parseAgentRunner(values.agent!);
  const reasoningEffort = parseReasoningEffort(values["reasoning-effort"]);
  if (reasoningEffort && agentRunner !== "codex") {
    throw new Error("--reasoning-effort is only supported with --agent codex");
  }
  const timeoutMs = Number(values["timeout-min"]) * 60_000;
  const judgeEnabled = !values["skip-judge"];

  assertAgentAuth(agentRunner);
  const judgeModel = values["judge-model"]!;
  if (judgeEnabled) {
    // Key the preflight on the resolved judge model, not the agent runner:
    // the pinned default judge model (gpt-5.6-sol) dispatches to OpenAI
    // regardless of which agent (claude/codex) is under test.
    if (judgeModel.startsWith("gpt") && !process.env.OPENAI_API_KEY) {
      throw new Error(
        `OPENAI_API_KEY is required for the LLM judge memo (judge model "${judgeModel}" dispatches to OpenAI). Pass --skip-judge to run without it.`
      );
    }
    if (!judgeModel.startsWith("gpt") && !process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        `ANTHROPIC_API_KEY is required for the LLM judge memo (judge model "${judgeModel}" dispatches to Anthropic). Pass --skip-judge to run without it.`
      );
    }
  }

  const startedAt = new Date().toISOString();
  const runId = buildRunId({
    taskIds,
    variant: variantLabel(conditionArgs),
    agentRunner,
    startedAt,
  });
  const batchId = values["batch-id"] || runId;
  const runDir = join(RESULTS_DIR, runId);
  await mkdir(join(runDir, "trials"), { recursive: true });

  const taskPromptHashes: Record<string, string> = {};
  const run: RunResult = {
    runId,
    batchId,
    startedAt,
    agentRunner,
    agentModel: resolveAgentDefaults(agentRunner, values.model, reasoningEffort)
      .model,
    judgeModel: judgeEnabled ? judgeModel : "skipped",
    manifest: {
      graderVersion: GRADER_VERSION,
      sandbox: process.env.MCP_USE_EVAL_SANDBOX === "docker" ? "docker" : "vercel",
      taskPromptHashes,
      skillHash: await skillHashIfUsed(variants),
    },
    trials: [],
  };

  for (const taskId of taskIds) {
    const task = await loadTask(taskId);
    taskPromptHashes[taskId] = task.promptHash;
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
          judgeModel: judgeEnabled ? judgeModel : null,
          timeoutMs,
          runDir,
        });
        run.trials.push(result);
        console.log(consoleLine(result));
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
 * e.g. "v2-01-basic-tool-server--noskill+blank--2026-06-11T18-40-40",
 *      "3-tasks--all-conditions--codex--2026-06-12T09-15-02"
 */
function buildRunId(opts: {
  taskIds: string[];
  variant: string;
  agentRunner: AgentRunner;
  startedAt: string;
}): string {
  const taskPart =
    opts.taskIds.length === 1
      ? opts.taskIds[0]
      : `${opts.taskIds.length}-tasks`;
  const variantPart = opts.variant === "all" ? "all-conditions" : opts.variant;
  const stamp = opts.startedAt.replace(/[:.]/g, "-").slice(0, 19);
  return [
    taskPart,
    variantPart,
    ...(opts.agentRunner === "codex" ? [opts.agentRunner] : []),
    stamp,
  ].join("--");
}

async function runTrial(opts: {
  task: LoadedTask;
  variant: Variant;
  trial: number;
  agentRunner: AgentRunner;
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
  const trialSlug = `${task.config.id}--${vid}--t${opts.trial}`;
  const trialDir = join(opts.runDir, "trials", trialSlug);
  await mkdir(trialDir, { recursive: true });

  const base: Omit<TrialResult, "valid" | "grade" | "perf"> = {
    task: task.config.id,
    variant: vid,
    trial: opts.trial,
    promptHash: hashPrompt(agentPrompt),
    agentRunner: opts.agentRunner,
    agentModel: resolveAgentDefaults(opts.agentRunner, opts.model, opts.reasoningEffort)
      .model,
    sdkVersion: null,
    memoPath: null,
    transcriptPath: null,
    timestamp: new Date().toISOString(),
    error: null,
  };

  const sandbox = await prepareWorkspace(variant, {
    skillTarget,
    taskDir: task.dir,
  }).catch(
    (err) => {
      return { error: String(err) } as const;
    }
  );
  if ("error" in sandbox) {
    return {
      ...base,
      valid: false,
      grade: emptyGrade("infra.sandbox"),
      perf: emptyPerf(),
      error: `sandbox: ${sandbox.error}`,
    };
  }

  let rawJsonl: string | null = null;
  let durationMs: number | null = null;
  let turns: number | null = null;
  let costUsd: number | null = null;
  let transcriptPath: string | null = null;
  let phaseError: { code: FailureCode; message: string } | null = null;
  // Set when the agent phase timed out but is deliberately still graded
  // (see classifyAgentOutcome) so the trial's `error` field explains why a
  // contract failure may actually be an unfinished run, not a broken build.
  let agentWarning: string | null = null;

  // ── agent phase ──
  try {
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
    try {
      const info = await runHarnessAgent({
        runner: opts.agentRunner,
        workspace: sandbox.workspace,
        prompt: agentPrompt,
        model: opts.model,
        reasoningEffort: opts.reasoningEffort,
        timeoutMs: opts.timeoutMs,
        extraEnv: Object.keys(agentEnv).length > 0 ? agentEnv : undefined,
      });
      durationMs = info.durationMs;
      turns = info.turns;
      costUsd = info.costUsd;
      rawJsonl = info.rawJsonl;
      await writeFile(join(trialDir, "transcript.jsonl"), info.rawJsonl);
      await writeFile(join(trialDir, "transcript.md"), info.transcriptMd);
      transcriptPath = join("trials", trialSlug, "transcript.md");

      // runHarnessAgent (src/agent.ts) never rejects — it swallows sandbox
      // provisioning failures, harness crashes, and sync failures internally
      // and always returns normally. Inspect the event stream it produced to
      // recover that classification here, so agent-phase infra failures
      // don't masquerade as scored contract failures (e.g. contract.install
      // on a blank workspace that the agent never actually touched).
      const outcome = classifyAgentOutcome(info.rawJsonl);
      if (outcome.kind === "infra") {
        phaseError = { code: "infra.agent", message: outcome.message };
      } else if (outcome.kind === "timeout") {
        // Defensible to still count a timeout against the agent (it had its
        // budget) — but tag it distinctly rather than let it silently
        // masquerade as an unexplained contract.install/entry failure.
        agentWarning = outcome.message;
      }
    } finally {
      await agentBackend?.stop();
    }
  } catch (err) {
    phaseError = { code: "infra.agent", message: String(err instanceof Error ? (err.stack ?? err.message) : err) };
  }

  // ── grading phase ──
  let grade: TrialGrade | null = null;
  let perf: TrialPerf | null = null;
  let sdkVersion: string | null = null;
  if (!phaseError) {
    try {
      grade = await gradeWorkspace({ workspace: sandbox.workspace, task });
      perf = perfFromRun({ rawJsonl, durationMs, turns, costUsd });
      sdkVersion = await installedSdkVersion(sandbox.workspace);
    } catch (err) {
      phaseError = {
        code: "infra.grader",
        message: String(err instanceof Error ? (err.stack ?? err.message) : err),
      };
    }
  }

  // ── judge (unscored; a memo failure never invalidates the trial) ──
  let memoPath: string | null = null;
  if (!phaseError && opts.judgeModel && grade && perf) {
    try {
      const memo = await writeMemo({
        task,
        variantId: vid,
        grade,
        perf,
        workspaceDir: sandbox.workspace,
        rawJsonl,
        model: opts.judgeModel,
      });
      await writeFile(join(trialDir, "memo.md"), memo);
      memoPath = join("trials", trialSlug, "memo.md");
    } catch (err) {
      console.error(`  ⚠️ judge memo failed: ${String(err)}`);
    }
  }

  await snapshotWorkspace(sandbox.workspace, join(trialDir, "workspace")).catch(
    () => {}
  );
  await sandbox.cleanup().catch(() => {});

  if (phaseError) {
    return {
      ...base,
      valid: false,
      grade: emptyGrade(phaseError.code),
      perf: emptyPerf(),
      transcriptPath,
      error: phaseError.message,
    };
  }

  return {
    ...base,
    sdkVersion,
    valid: true,
    grade: grade!,
    perf: perf!,
    memoPath,
    transcriptPath,
    error: agentWarning,
  };
}

/**
 * runHarnessAgent (src/agent.ts) catches all its own errors and always
 * resolves — it never rejects. Reconstruct what actually happened from the
 * event stream it hands back:
 *  - a `{type:"result"}` event only gets pushed once the harness completed
 *    a full turn and (on remote sandboxes) synced the workspace back.
 *  - a `{type:"harness"}` event with a note carries whatever went wrong
 *    (timeout, harness crash, or a failed post-error workspace sync).
 */
function classifyAgentOutcome(
  rawJsonl: string
): { kind: "ok" } | { kind: "timeout"; message: string } | { kind: "infra"; message: string } {
  let hasResult = false;
  let hasZeroUsageResult = false;
  let timeoutNote: string | null = null;
  let infraNote: string | null = null;

  for (const line of rawJsonl.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(trimmed);
    } catch {
      continue;
    }
    if (event.type === "result") {
      hasResult = true;
      const usage = event.total_usage as
        | { inputTokens?: number; outputTokens?: number }
        | undefined;
      if ((usage?.inputTokens ?? 0) === 0 && (usage?.outputTokens ?? 0) === 0) {
        hasZeroUsageResult = true;
      }
    } else if (event.type === "harness" && typeof event.note === "string") {
      const note = event.note;
      if (note.startsWith("agent timed out")) {
        timeoutNote = note;
      } else if (
        note.startsWith("AI SDK harness error:") ||
        note.startsWith("failed to sync remote workspace") ||
        note.startsWith("failed to destroy harness session")
      ) {
        infraNote = note;
      }
    }
  }

  // A failed post-error sync or a raw harness error means the workspace we
  // are about to grade cannot be trusted to reflect the agent's actual work
  // (or the harness never produced a result at all) — infra, not contract.
  if (infraNote) return { kind: "infra", message: infraNote };
  if (!hasResult) {
    return {
      kind: timeoutNote ? "timeout" : "infra",
      message: timeoutNote ?? "agent run produced no result event",
    };
  }
  // A "successful" result with zero input/output tokens means no model turn
  // actually happened (sandbox/bridge failure swallowed upstream) — grading
  // the untouched workspace would misreport this as a scored contract
  // failure (e.g. contract.install on a blank workspace the agent never saw).
  if (hasZeroUsageResult && !timeoutNote) {
    return {
      kind: "infra",
      message:
        "agent run reported success but consumed zero input/output tokens — no model turn occurred",
    };
  }
  if (timeoutNote) return { kind: "timeout", message: timeoutNote };
  return { kind: "ok" };
}

function emptyGrade(failureCode: FailureCode): TrialGrade {
  return {
    contractPass: false,
    checks: [],
    failureCode,
    sdkPath: "unknown",
    scoredForPassRate: false,
  };
}

function emptyPerf(): TrialPerf {
  return {
    durationMs: null,
    turns: null,
    tokensIn: null,
    tokensOut: null,
    toolCalls: null,
    costUsd: null,
  };
}

function consoleLine(result: TrialResult): string {
  const passed = result.grade.checks.filter((c) => c.pass).length;
  const total = result.grade.checks.length;
  const ok = result.valid && result.grade.contractPass;
  const codePart = result.grade.failureCode ? ` (${result.grade.failureCode})` : "";
  const durationPart =
    result.perf.durationMs !== null
      ? ` · ${formatDuration(result.perf.durationMs)}`
      : "";
  const costPart =
    result.perf.costUsd !== null ? ` · $${result.perf.costUsd.toFixed(2)}` : "";
  const errorPart = result.error ? ` · ⚠️ ${result.error}` : "";
  return `  ${ok ? "pass ✅" : "fail ❌"}${codePart} · checks ${passed}/${total} · sdk ${result.grade.sdkPath}${durationPart}${costPart}${errorPart}`;
}

function formatDuration(ms: number): string {
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return m > 0 ? `${m}m${s}s` : `${s}s`;
}

async function skillHashIfUsed(variants: Variant[]): Promise<string | null> {
  if (!variants.some((v) => v.skill)) return null;
  try {
    const content = await readFile(join(SKILL_DIR, "SKILL.md"), "utf8");
    return createHash("sha256").update(content).digest("hex");
  } catch {
    return null;
  }
}

function parseAgentRunner(value: string): AgentRunner {
  if (value === "claude" || value === "codex") return value;
  throw new Error(`unknown agent runner "${value}" (expected claude or codex)`);
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
      throw new Error("all cannot be combined with other conditions");
    }
    return ALL_VARIANTS;
  }
  const seen = new Set<string>();
  return ids
    .filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map(parseVariant);
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

  if (prefix.length === 0) return prompt;
  return [...prefix, "", prompt].join("\n");
}

function hashPrompt(prompt: string): string {
  return createHash("sha256").update(prompt).digest("hex").slice(0, 12);
}

function skillTargetForAgent(agentRunner: AgentRunner): SkillTarget {
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
