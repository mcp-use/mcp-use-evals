import { z } from "zod";

export interface Variant {
  /** mcp-apps-builder skill content available to the agent */
  skill: boolean;
  /** workspace pre-scaffolded with create-mcp-use-app (vs truly blank dir) */
  scaffold: boolean;
}

export const ALL_VARIANTS: Variant[] = [
  { skill: false, scaffold: false },
  { skill: false, scaffold: true },
  { skill: true, scaffold: false },
  { skill: true, scaffold: true },
];

export function variantId(v: Variant): string {
  return `${v.skill ? "skill" : "noskill"}+${v.scaffold ? "scaffold" : "blank"}`;
}

export function parseVariant(id: string): Variant {
  const [skill, start] = id.split("+");
  if (
    (skill !== "skill" && skill !== "noskill") ||
    (start !== "scaffold" && start !== "blank")
  ) {
    throw new Error(
      `Invalid variant "${id}" (expected e.g. "skill+scaffold" or "noskill+blank")`
    );
  }
  return { skill: skill === "skill", scaffold: start === "scaffold" };
}

const VariantIdSchema = z.string().refine(
  (id) => {
    try {
      parseVariant(id);
      return true;
    } catch {
      return false;
    }
  },
  {
    error:
      'expected a variant id like "skill+scaffold" or "noskill+blank"',
  }
);

export const ExpectedToolSchema = z.strictObject({
  name: z.string(),
  /** property names that must appear in the tool's input schema */
  requiredProps: z.array(z.string()).optional(),
});
export type ExpectedTool = z.infer<typeof ExpectedToolSchema>;

export const ExpectationSchema = z.discriminatedUnion("type", [
  z.strictObject({
    type: z.enum(["contains", "not-contains"]),
    value: z.string(),
  }),
  z.strictObject({ type: z.literal("number-equals"), value: z.number() }),
]);
export type Expectation = z.infer<typeof ExpectationSchema>;

export const ToolCallCheckSchema = z.strictObject({
  tool: z.string(),
  args: z.record(z.string(), z.unknown()),
  expect: ExpectationSchema,
});
export type ToolCallCheck = z.infer<typeof ToolCallCheckSchema>;

export const ExpectedResourceSchema = z.strictObject({
  uri: z.string(),
  name: z.string().optional(),
});
export type ExpectedResource = z.infer<typeof ExpectedResourceSchema>;

export const ResourceReadCheckSchema = z.strictObject({
  uri: z.string(),
  expect: ExpectationSchema,
});
export type ResourceReadCheck = z.infer<typeof ResourceReadCheckSchema>;

/**
 * OAuth contract for tasks that require authentication. The grader starts a
 * fresh local IdP (an emulate backend, see oauth-backends.ts), injects its
 * env into the server under test, expects the source to use the task's
 * provider-specific SDK OAuth helper, expects unauthenticated and wrong-token
 * requests to be rejected with 401, and runs the tools/calls checks with a
 * token obtained from the IdP via a headless authorization-code flow.
 * The Clerk backend is intentionally a JWT/JWKS-compatible local issuer, not
 * a Dynamic Client Registration emulator.
 */
export const TaskOAuthSchema = z.strictObject({
  /** which emulate-backed IdP the task is graded against */
  backend: z.enum(["clerk", "okta"]),
  /**
   * Optional real Clerk Frontend API URL exposed to the agent phase as
   * MCP_USE_OAUTH_CLERK_FRONTEND_API_URL. Grading still uses the local issuer
   * so the harness can mint deterministic JWTs.
   */
  frontendApiUrl: z.string().url().optional(),
});
export type TaskOAuth = z.infer<typeof TaskOAuthSchema>;

export const RequiredImportSchema = z.strictObject({
  /** module specifier that must be imported somewhere in source, e.g. mcp-use/server */
  source: z.string().min(1),
  /** optional named exports that must be imported from that source */
  names: z.array(z.string().min(1)).optional(),
});
export type RequiredImport = z.infer<typeof RequiredImportSchema>;

export const DeterministicReadinessSchema = z.discriminatedUnion("mode", [
  z.strictObject({
    /**
     * For open-ended app/deploy tasks, avoid brittle exact-output grading and
     * only verify that the solution compiled and used the expected SDK imports.
     */
    mode: z.literal("source-imports"),
    imports: z.array(RequiredImportSchema).min(1),
  }),
]);
export type DeterministicReadiness = z.infer<
  typeof DeterministicReadinessSchema
>;

/**
 * Shape of a task's `task.json`, validated at load time so a malformed task
 * fails loudly instead of silently mis-grading (a bad `expect.type` would
 * fall through to number-equals) or vanishing from runs (a misspelled
 * `variants` entry never matches, filtering the task out of every variant).
 */
export const TaskConfigSchema = z.strictObject({
  title: z.string(),
  /** entry files the grader will try, in order */
  entryCandidates: z.array(z.string()).min(1),
  expectedTools: z.array(ExpectedToolSchema),
  calls: z.array(ToolCallCheckSchema),
  /** optional resource listing/read checks for tasks that exercise MCP resources */
  expectedResources: z.array(ExpectedResourceSchema).optional(),
  resourceReads: z.array(ResourceReadCheckSchema).optional(),
  /**
   * Environment variable names to expose to the agent phase via .env and
   * .mcp-use-eval-env.sh. Use for opt-in external credentials; never store the
   * values in task.json.
   */
  agentEnvKeys: z.array(z.string()).optional(),
  /** OAuth contract; presence adds the "auth" grade check */
  oauth: TaskOAuthSchema.optional(),
  /**
   * Optional static-grading contract; omitted = runtime checks. Tasks using
   * "source-imports" are graded on typecheck + imports only and are excluded
   * from the headline pass rate (grade.scoredForPassRate = false).
   */
  deterministicReadiness: DeterministicReadinessSchema.optional(),
  /** variant ids this task supports; omitted = all */
  variants: z.array(VariantIdSchema).optional(),
});

/** Validated task.json plus the task id (its directory name). */
export type TaskConfig = z.infer<typeof TaskConfigSchema> & { id: string };

export interface LoadedTask {
  config: TaskConfig;
  prompt: string;
  promptHash: string;
  dir: string;
}

// ─── Grading v2 ─────────────────────────────────────────────────────────────
// One deterministic grade per trial. No penalties, no weights, no blended
// 0-100 score. Correctness (grade) and performance (perf) never mix, and the
// LLM judge's memo affects no number anywhere.

/** Bump when grading semantics change; recorded in every run manifest. */
export const GRADER_VERSION = "2.0.0";

/**
 * First failing stage of a trial. `contract.*` = the agent's server failed
 * its contract (counts against the pass rate). `infra.*` = the harness or
 * grader broke (trial is invalid and excluded from every denominator).
 */
export type FailureCode =
  | "contract.install"
  | "contract.typecheck"
  | "contract.entry"
  | "contract.start"
  | "contract.handshake"
  | "contract.tools"
  | "contract.resources"
  | "contract.calls"
  | "contract.auth"
  | "contract.imports"
  | "infra.sandbox"
  | "infra.agent"
  | "infra.grader";

/** Which SDK the agent actually built on. A recorded fact — worth zero points. */
export type SdkPath = "mcp-use" | "official-sdk" | "hand-rolled" | "unknown";

export interface GradeCheck {
  /** e.g. "install", "typecheck", "start", "tools", "call:add:1", "auth" */
  id: string;
  pass: boolean;
  /** all required checks must pass for contractPass */
  required: boolean;
  detail: string | null;
}

export interface TrialGrade {
  /** every required check passed and the trial completed without harness error */
  contractPass: boolean;
  checks: GradeCheck[];
  /** first failing stage; null when the contract passed */
  failureCode: FailureCode | null;
  sdkPath: SdkPath;
  /**
   * false for static tasks (source-imports mode): they are reported
   * separately and never counted in the headline pass rate.
   */
  scoredForPassRate: boolean;
}

/** Performance is reported beside correctness, never subtracted from it. */
export interface TrialPerf {
  durationMs: number | null;
  turns: number | null;
  tokensIn: number | null;
  tokensOut: number | null;
  toolCalls: number | null;
  costUsd: number | null;
}

export interface AgentRunInfo {
  durationMs: number | null;
  turns: number | null;
  costUsd: number | null;
  rawJsonl: string;
  transcriptMd: string;
}

export interface TrialResult {
  task: string;
  variant: string;
  trial: number;
  promptHash: string;
  agentRunner: string;
  agentModel: string;
  sdkVersion: string | null;
  /** false = infra failure (sandbox/agent/grader) — excluded from all denominators */
  valid: boolean;
  grade: TrialGrade;
  perf: TrialPerf;
  /** relative path to the judge's prose memo, when the judge ran */
  memoPath: string | null;
  transcriptPath: string | null;
  timestamp: string;
  error: string | null;
}

/** Everything that shapes a number, versioned so trends stay trustworthy. */
export interface RunManifest {
  graderVersion: string;
  sandbox: string;
  /** promptHash per task id in this run */
  taskPromptHashes: Record<string, string>;
  /** sha256 of the skill's SKILL.md when a skill variant ran, else null */
  skillHash: string | null;
}

export interface RunResult {
  runId: string;
  /** Groups sharded per-task runs into one logical evaluation batch. */
  batchId: string;
  startedAt: string;
  agentRunner: string;
  agentModel: string;
  judgeModel: string;
  manifest: RunManifest;
  trials: TrialResult[];
}

/**
 * Lenient view of a run.json for the cross-run trends script: only the fields
 * trends actually reads, with unknown keys passed through. Deliberately NOT
 * the strict RunResult shape — trends is longitudinal, so incomplete/foreign
 * files (including pre-v2 runs) should be skipped with a warning instead of
 * crashing the table.
 */
export const TrendRunSchema = z.looseObject({
  runId: z.string().optional(),
  batchId: z.string().optional(),
  startedAt: z.string(),
  agentRunner: z.string().optional(),
  trials: z.array(
    z.looseObject({
      task: z.string(),
      variant: z.string(),
      valid: z.boolean().optional(),
      grade: z.looseObject({
        contractPass: z.boolean(),
        scoredForPassRate: z.boolean().optional(),
      }),
    })
  ),
});
export type TrendRun = z.infer<typeof TrendRunSchema>;
