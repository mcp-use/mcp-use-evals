import Anthropic from "@anthropic-ai/sdk";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { TrendRunSchema } from "./types.js";

/**
 * Weekly synthesis: reads the window's runs + judge memos, computes every
 * number deterministically in code (the model is never asked to do math),
 * and asks a strong model to write the prose report around those numbers.
 * No penalties, no blended scores — same rule as the rest of the pipeline.
 */

const DEFAULT_SYNTHESIS_MODEL = "gpt-5.6-sol";
/** Webhook payload cap; Slack silently drops much larger messages. */
const SLACK_TEXT_CAP = 39_000;
/** Total memo payload cap for the model prompt; oldest memos drop first. */
const DEFAULT_MEMO_CHAR_CAP = 200_000;

const HELP = `mcp-use SDK evals — weekly synthesis (pnpm synthesize)

Usage: pnpm synthesize [options]

  --days <n>           window length in days (default: 7). The previous
                       window (same length, immediately before) is used for
                       week-over-week deltas.
  --results-dir <dir>  directory containing run-id subdirectories, each with
                       a run.json (default: results)
  --model <id>         synthesis model (default: $SYNTHESIS_MODEL or
                       "${DEFAULT_SYNTHESIS_MODEL}")
  --out <path>         report output path (default: results/synthesis/<date>.md)
  --slack              also POST the executive summary to $SLACK_WEBHOOK_URL
  --dry-run            build the prompt and print the computed stats, skip
                       the model call (and --slack)
  --help
`;

// ─── Duck-typed v2 run/trial shapes ─────────────────────────────────────────
// TrendRunSchema (src/types.ts) is a z.looseObject at every level, so extra
// v2 fields (grade.checks, grade.failureCode, grade.sdkPath, perf, memoPath,
// …) survive parsing even though the schema only names a few of them. We
// gate on TrendRunSchema (old-schema run.json files fail it and are skipped)
// then duck-type the richer shape back out of the same parsed object.

interface RawPerf {
  durationMs?: number | null;
  turns?: number | null;
  tokensIn?: number | null;
  tokensOut?: number | null;
  toolCalls?: number | null;
  costUsd?: number | null;
}

interface RawTrial {
  task: string;
  variant: string;
  trial?: number;
  agentRunner?: string;
  valid?: boolean;
  memoPath?: string | null;
  grade?: {
    contractPass: boolean;
    failureCode?: string | null;
    sdkPath?: string;
    scoredForPassRate?: boolean;
  };
  perf?: RawPerf | null;
}

interface RawRun {
  runId?: string;
  batchId?: string;
  startedAt: string;
  agentRunner?: string;
  trials: RawTrial[];
}

/** A trial flattened out of its run, with the run's location attached. */
interface SynthesisTrial {
  runDir: string;
  batchId: string;
  startedAt: string;
  agentRunner: string;
  task: string;
  variant: string;
  valid: boolean;
  contractPass: boolean;
  scoredForPassRate: boolean;
  failureCode: string | null;
  sdkPath: string | null;
  perf: RawPerf | null;
  memoPath: string | null;
}

async function collectRuns(
  resultsDir: string
): Promise<Array<{ dir: string; run: RawRun }>> {
  let entries;
  try {
    entries = await readdir(resultsDir, { withFileTypes: true });
  } catch {
    console.warn(`⚠️  ${resultsDir} does not exist yet — no runs to read.`);
    return [];
  }

  const runs: Array<{ dir: string; run: RawRun }> = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const runDir = join(resultsDir, entry.name);
    let raw: string;
    try {
      raw = await readFile(join(runDir, "run.json"), "utf8");
    } catch {
      continue; // no run.json — incomplete or foreign dir, skip quietly
    }
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      console.warn(`⚠️  skipping ${entry.name}: run.json is not valid JSON`);
      continue;
    }
    const parsed = TrendRunSchema.safeParse(json);
    if (!parsed.success) {
      console.warn(
        `⚠️  skipping ${entry.name}: run.json doesn't match the v2 schema (pre-v2 run?)`
      );
      continue;
    }
    // parsed.data is built from z.looseObject at every level, so it already
    // carries the full v2 shape — just widen the type back out.
    runs.push({ dir: runDir, run: parsed.data as unknown as RawRun });
  }
  return runs;
}

function flattenTrials(
  runs: Array<{ dir: string; run: RawRun }>
): SynthesisTrial[] {
  const out: SynthesisTrial[] = [];
  for (const { dir, run } of runs) {
    for (const t of run.trials) {
      out.push({
        runDir: dir,
        batchId: run.batchId ?? run.runId ?? dir,
        startedAt: run.startedAt,
        agentRunner: t.agentRunner ?? run.agentRunner ?? "unknown",
        task: t.task,
        variant: t.variant,
        valid: t.valid ?? true,
        contractPass: t.grade?.contractPass ?? false,
        scoredForPassRate: t.grade?.scoredForPassRate ?? true,
        failureCode: t.grade?.failureCode ?? null,
        sdkPath: t.grade?.sdkPath ?? null,
        perf: t.perf ?? null,
        memoPath: t.memoPath ?? null,
      });
    }
  }
  return out;
}

function inWindow(isoDate: string, start: Date, end: Date): boolean {
  const ms = Date.parse(isoDate);
  return Number.isFinite(ms) && ms >= start.getTime() && ms < end.getTime();
}

// ─── Deterministic stats ────────────────────────────────────────────────────

interface CellStats {
  task: string;
  variant: string;
  trials: number;
  passed: number;
  allPass: boolean;
}

/** One logical evaluation batch, potentially assembled from sharded task jobs. */
interface BatchStats {
  batchId: string;
  startedAt: string;
  agent: string;
  conditions: string;
  taskCount: number;
  scoredTrials: number;
  passedTrials: number;
  invalidTrials: number;
}

interface DeltaEntry {
  label: string;
  aLabel: string;
  aTrials: number;
  aPassed: number;
  bLabel: string;
  bTrials: number;
  bPassed: number;
  /** (a rate − b rate) in percentage points, null if either side has no trials */
  deltaPct: number | null;
}

interface PerfStats {
  medianDurationMs: number | null;
  medianTurns: number | null;
  medianToolCalls: number | null;
  medianTokensIn: number | null;
  medianTokensOut: number | null;
  totalCostUsd: number | null;
  costKnownTrials: number;
  passingTrials: number;
  costPerSuccess: number | null;
}

interface WindowStats {
  scoredTrials: number;
  passedTrials: number;
  passRate: number | null;
  byTask: Map<string, { trials: number; passed: number }>;
  byVariant: Map<string, { trials: number; passed: number }>;
  batches: BatchStats[];
  cells: CellStats[];
  passK: {
    k: number;
    cellsConsidered: number;
    cellsAllPass: number;
    fraction: number;
  } | null;
  failureCodeCounts: Map<string, number>;
  infraCodeCounts: Map<string, number>;
  sdkPathCounts: Map<string, number>;
  perf: PerfStats;
  deltasOverall: DeltaEntry[];
  deltasByTask: DeltaEntry[];
  staticTasks: Map<string, { trials: number; typecheckImportsPass: number }>;
}

function countBy<T>(items: T[], key: (item: T) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

function groupCount(
  items: SynthesisTrial[],
  key: (t: SynthesisTrial) => string
): Map<string, { trials: number; passed: number }> {
  const map = new Map<string, { trials: number; passed: number }>();
  for (const t of items) {
    const k = key(t);
    const entry = map.get(k) ?? { trials: 0, passed: 0 };
    entry.trials += 1;
    if (t.contractPass) entry.passed += 1;
    map.set(k, entry);
  }
  return map;
}

function summarizeBatches(trials: SynthesisTrial[]): BatchStats[] {
  const grouped = new Map<
    string,
    {
      batchId: string;
      startedAt: string;
      agents: Set<string>;
      conditions: Set<string>;
      tasks: Set<string>;
      scoredTrials: number;
      passedTrials: number;
      invalidTrials: number;
    }
  >();

  for (const trial of trials) {
    const entry = grouped.get(trial.batchId) ?? {
      batchId: trial.batchId,
      startedAt: trial.startedAt,
      agents: new Set<string>(),
      conditions: new Set<string>(),
      tasks: new Set<string>(),
      scoredTrials: 0,
      passedTrials: 0,
      invalidTrials: 0,
    };
    entry.agents.add(trial.agentRunner);
    entry.conditions.add(trial.variant);
    entry.tasks.add(trial.task);
    if (!trial.valid) entry.invalidTrials += 1;
    if (trial.valid && trial.scoredForPassRate) {
      entry.scoredTrials += 1;
      if (trial.contractPass) entry.passedTrials += 1;
    }
    grouped.set(trial.batchId, entry);
  }

  return [...grouped.values()]
    .map((batch) => ({
      batchId: batch.batchId,
      startedAt: batch.startedAt,
      agent: [...batch.agents].sort().join(", "),
      conditions: [...batch.conditions].sort().join(", "),
      taskCount: batch.tasks.size,
      scoredTrials: batch.scoredTrials,
      passedTrials: batch.passedTrials,
      invalidTrials: batch.invalidTrials,
    }))
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

function median(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function numbers(
  trials: SynthesisTrial[],
  pick: (p: RawPerf) => number | null | undefined
): number[] {
  return trials
    .map((t) => (t.perf ? pick(t.perf) : null))
    .filter((x): x is number => typeof x === "number");
}

function computePerf(passingTrials: SynthesisTrial[]): PerfStats {
  const costs = numbers(passingTrials, (p) => p.costUsd);
  const totalCostUsd = costs.length > 0 ? costs.reduce((a, b) => a + b, 0) : null;
  return {
    medianDurationMs: median(numbers(passingTrials, (p) => p.durationMs)),
    medianTurns: median(numbers(passingTrials, (p) => p.turns)),
    medianToolCalls: median(numbers(passingTrials, (p) => p.toolCalls)),
    medianTokensIn: median(numbers(passingTrials, (p) => p.tokensIn)),
    medianTokensOut: median(numbers(passingTrials, (p) => p.tokensOut)),
    totalCostUsd,
    costKnownTrials: costs.length,
    passingTrials: passingTrials.length,
    costPerSuccess:
      totalCostUsd !== null && passingTrials.length > 0
        ? totalCostUsd / passingTrials.length
        : null,
  };
}

function makeDelta(
  label: string,
  aLabel: string,
  a: { trials: number; passed: number },
  bLabel: string,
  b: { trials: number; passed: number }
): DeltaEntry {
  const aRate = a.trials > 0 ? a.passed / a.trials : null;
  const bRate = b.trials > 0 ? b.passed / b.trials : null;
  return {
    label,
    aLabel,
    aTrials: a.trials,
    aPassed: a.passed,
    bLabel,
    bTrials: b.trials,
    bPassed: b.passed,
    deltaPct: aRate !== null && bRate !== null ? (aRate - bRate) * 100 : null,
  };
}

/** Same condition-id strings `variantId()` in types.ts produces. */
const SKILL_SCAFFOLDS = ["blank", "scaffold"] as const;

function computeDeltas(cells: CellStats[]): {
  overall: DeltaEntry[];
  byTask: DeltaEntry[];
} {
  const byVariantOverall = new Map<string, { trials: number; passed: number }>();
  for (const c of cells) {
    const entry = byVariantOverall.get(c.variant) ?? { trials: 0, passed: 0 };
    entry.trials += c.trials;
    entry.passed += c.passed;
    byVariantOverall.set(c.variant, entry);
  }

  const overall: DeltaEntry[] = [];
  for (const scaffold of SKILL_SCAFFOLDS) {
    const skill = byVariantOverall.get(`skill+${scaffold}`);
    const noskill = byVariantOverall.get(`noskill+${scaffold}`);
    if (skill && noskill) {
      overall.push(
        makeDelta(
          `skill vs noskill (${scaffold})`,
          `skill+${scaffold}`,
          skill,
          `noskill+${scaffold}`,
          noskill
        )
      );
    }
  }
  const byTaskMap = new Map<string, CellStats[]>();
  for (const c of cells) {
    byTaskMap.set(c.task, [...(byTaskMap.get(c.task) ?? []), c]);
  }
  const byTask: DeltaEntry[] = [];
  for (const [task, taskCells] of [...byTaskMap.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    const byVariant = new Map(taskCells.map((c) => [c.variant, c]));
    for (const scaffold of SKILL_SCAFFOLDS) {
      const skill = byVariant.get(`skill+${scaffold}`);
      const noskill = byVariant.get(`noskill+${scaffold}`);
      if (skill && noskill) {
        byTask.push(
          makeDelta(
            `${task}: skill vs noskill (${scaffold})`,
            `skill+${scaffold}`,
            skill,
            `noskill+${scaffold}`,
            noskill
          )
        );
      }
    }
  }

  return { overall, byTask };
}

function computeWindowStats(trials: SynthesisTrial[]): WindowStats {
  const scored = trials.filter((t) => t.valid && t.scoredForPassRate);
  const passedTrials = scored.filter((t) => t.contractPass).length;

  const byTask = groupCount(scored, (t) => t.task);
  const byVariant = groupCount(scored, (t) => t.variant);
  const batches = summarizeBatches(trials);

  const cellMap = new Map<string, SynthesisTrial[]>();
  for (const t of scored) {
    const key = `${t.task}\u0000${t.variant}`;
    cellMap.set(key, [...(cellMap.get(key) ?? []), t]);
  }
  const cells: CellStats[] = [...cellMap.entries()].map(([key, ts]) => {
    const [task, variant] = key.split("\u0000");
    const passed = ts.filter((t) => t.contractPass).length;
    return { task, variant, trials: ts.length, passed, allPass: passed === ts.length };
  });

  const multiTrialCells = cells.filter((c) => c.trials >= 2);
  const passK =
    multiTrialCells.length > 0
      ? (() => {
          const k = Math.min(...multiTrialCells.map((c) => c.trials));
          const cellsAllPass = multiTrialCells.filter((c) => c.allPass).length;
          return {
            k,
            cellsConsidered: multiTrialCells.length,
            cellsAllPass,
            fraction: cellsAllPass / multiTrialCells.length,
          };
        })()
      : null;

  const failureCodeCounts = countBy(
    scored.filter((t) => !t.contractPass && t.failureCode?.startsWith("contract.")),
    (t) => t.failureCode!
  );
  const infraCodeCounts = countBy(
    trials.filter((t) => !t.valid && t.failureCode?.startsWith("infra.")),
    (t) => t.failureCode!
  );
  const sdkPathCounts = countBy(
    scored.filter((t) => t.sdkPath),
    (t) => t.sdkPath!
  );

  const perf = computePerf(scored.filter((t) => t.contractPass));
  const { overall: deltasOverall, byTask: deltasByTask } = computeDeltas(cells);

  const staticTasks = new Map<string, { trials: number; typecheckImportsPass: number }>();
  for (const t of trials.filter((t) => t.valid && !t.scoredForPassRate)) {
    const entry = staticTasks.get(t.task) ?? { trials: 0, typecheckImportsPass: 0 };
    entry.trials += 1;
    if (t.contractPass) entry.typecheckImportsPass += 1;
    staticTasks.set(t.task, entry);
  }

  return {
    scoredTrials: scored.length,
    passedTrials,
    passRate: scored.length > 0 ? passedTrials / scored.length : null,
    byTask,
    byVariant,
    batches,
    cells,
    passK,
    failureCodeCounts,
    infraCodeCounts,
    sdkPathCounts,
    perf,
    deltasOverall,
    deltasByTask,
    staticTasks,
  };
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function fmtPct(rate: number | null): string {
  return rate === null ? "—" : `${Math.round(rate * 100)}%`;
}

function fmtPctPoints(pp: number | null): string {
  if (pp === null) return "—";
  const sign = pp > 0 ? "+" : "";
  return `${sign}${pp.toFixed(1)}pp`;
}

function fmtDuration(ms: number | null): string {
  if (ms === null) return "—";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m${String(s).padStart(2, "0")}s`;
}

function fmtMoney(n: number | null): string {
  return n === null ? "—" : `$${n.toFixed(2)}`;
}

function fmtNum(n: number | null): string {
  return n === null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

function fmtDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function table(headers: string[], rows: string[][]): string {
  if (rows.length === 0) return "_(none)_";
  const lines = [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

function renderStatsBlock(opts: {
  days: number;
  windowStart: Date;
  windowEnd: Date;
  prevWindowStart: Date;
  prevWindowEnd: Date;
  current: WindowStats;
  previous: WindowStats;
}): string {
  const { days, windowStart, windowEnd, prevWindowStart, prevWindowEnd, current, previous } = opts;
  const lines: string[] = [];

  lines.push(
    `**Window**: ${fmtDate(windowStart)} → ${fmtDate(windowEnd)} (${days}d) · **Previous window**: ${fmtDate(prevWindowStart)} → ${fmtDate(prevWindowEnd)}`
  );
  lines.push("");
  lines.push(
    `**Pass rate**: ${fmtPct(current.passRate)} (${current.passedTrials}/${current.scoredTrials} valid scored trials) — previous: ${fmtPct(previous.passRate)} (${previous.passedTrials}/${previous.scoredTrials})`
  );
  lines.push("");

  lines.push("### Evaluation batches");
  lines.push(
    table(
      ["date", "batch", "agent", "condition", "pass rate", "tasks", "invalid"],
      current.batches.map((batch) => [
        batch.startedAt.slice(0, 10),
        batch.batchId,
        batch.agent,
        batch.conditions,
        `${fmtPct(batch.scoredTrials > 0 ? batch.passedTrials / batch.scoredTrials : null)} (${batch.passedTrials}/${batch.scoredTrials})`,
        String(batch.taskCount),
        String(batch.invalidTrials),
      ])
    )
  );
  lines.push("");

  const taskRows = [...new Set([...current.byTask.keys(), ...previous.byTask.keys()])]
    .sort()
    .map((task) => {
      const c = current.byTask.get(task);
      const p = previous.byTask.get(task);
      const cRate = c ? fmtPct(c.passed / c.trials) : "—";
      const pRate = p ? fmtPct(p.passed / p.trials) : "—";
      return [
        task,
        c ? `${cRate} (${c.passed}/${c.trials})` : "—",
        p ? `${pRate} (${p.passed}/${p.trials})` : "—",
      ];
    });
  lines.push("### Pass rate by task");
  lines.push(table(["task", "current", "previous"], taskRows));
  lines.push("");

  const variantRows = [...new Set([...current.byVariant.keys(), ...previous.byVariant.keys()])]
    .sort()
    .map((variant) => {
      const c = current.byVariant.get(variant);
      const p = previous.byVariant.get(variant);
      return [
        variant,
        c ? `${fmtPct(c.passed / c.trials)} (${c.passed}/${c.trials})` : "—",
        p ? `${fmtPct(p.passed / p.trials)} (${p.passed}/${p.trials})` : "—",
      ];
    });
  lines.push("### Pass rate by condition");
  lines.push(table(["condition", "current", "previous"], variantRows));
  lines.push("");

  lines.push("### pass^k (all-k-trials-pass per task×condition cell, current window)");
  if (current.passK) {
    lines.push(
      `k=${current.passK.k}: ${current.passK.cellsAllPass}/${current.passK.cellsConsidered} cells passed all ${current.passK.k} trials (${fmtPct(current.passK.fraction)})`
    );
  } else {
    lines.push("_not enough repeated trials yet (need ≥2 trials in at least one task×condition cell)_");
  }
  lines.push("");

  if (current.staticTasks.size > 0) {
    lines.push("### Static adoption tasks (source-imports mode, not in pass rate)");
    lines.push(
      table(
        ["task", "trials", "typecheck+imports pass"],
        [...current.staticTasks.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([task, s]) => [task, String(s.trials), `${s.typecheckImportsPass}/${s.trials}`])
      )
    );
    lines.push("");
  }

  lines.push("### Failure breakdown (contract.*, current window)");
  lines.push(
    table(
      ["failureCode", "count"],
      [...current.failureCodeCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([code, n]) => [code, String(n)])
    )
  );
  lines.push("");

  lines.push("### Infra failures (invalid trials, excluded from pass rate, current window)");
  lines.push(
    table(
      ["failureCode", "count"],
      [...current.infraCodeCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([code, n]) => [code, String(n)])
    )
  );
  lines.push("");

  lines.push("### SDK path (current window, scored trials)");
  lines.push(
    table(
      ["sdkPath", "count"],
      [...current.sdkPathCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([path, n]) => [path, String(n)])
    )
  );
  lines.push("");

  lines.push("### Performance (passing trials only, current window)");
  lines.push(
    table(
      ["metric", "value"],
      [
        ["median duration", fmtDuration(current.perf.medianDurationMs)],
        ["median turns", fmtNum(current.perf.medianTurns)],
        ["median tool calls", fmtNum(current.perf.medianToolCalls)],
        ["median tokens in", fmtNum(current.perf.medianTokensIn)],
        ["median tokens out", fmtNum(current.perf.medianTokensOut)],
        [
          "total cost",
          `${fmtMoney(current.perf.totalCostUsd)} (${current.perf.costKnownTrials}/${current.perf.passingTrials} passing trials had known cost)`,
        ],
        ["cost per success", fmtMoney(current.perf.costPerSuccess)],
      ]
    )
  );
  lines.push("");

  lines.push("### Deltas — skill vs noskill (current window)");
  lines.push("**Overall (pooled across tasks):**");
  lines.push(
    table(
      ["comparison", "a", "b", "delta (a − b)"],
      current.deltasOverall.map((d) => [
        d.label,
        `${d.aLabel}: ${fmtPct(d.aTrials > 0 ? d.aPassed / d.aTrials : null)} (${d.aPassed}/${d.aTrials})`,
        `${d.bLabel}: ${fmtPct(d.bTrials > 0 ? d.bPassed / d.bTrials : null)} (${d.bPassed}/${d.bTrials})`,
        fmtPctPoints(d.deltaPct),
      ])
    )
  );
  if (current.deltasByTask.length > 0) {
    lines.push("");
    lines.push("**Per task:**");
    lines.push(
      table(
        ["comparison", "a", "b", "delta (a − b)"],
        current.deltasByTask.map((d) => [
          d.label,
          `${fmtPct(d.aTrials > 0 ? d.aPassed / d.aTrials : null)} (${d.aPassed}/${d.aTrials})`,
          `${fmtPct(d.bTrials > 0 ? d.bPassed / d.bTrials : null)} (${d.bPassed}/${d.bTrials})`,
          fmtPctPoints(d.deltaPct),
        ])
      )
    );
  }

  return lines.join("\n");
}

// ─── Memo gathering ──────────────────────────────────────────────────────────

interface MemoBundle {
  text: string;
  totalCount: number;
  includedCount: number;
  droppedCount: number;
}

async function collectMemos(
  trials: SynthesisTrial[],
  capChars = DEFAULT_MEMO_CHAR_CAP
): Promise<MemoBundle> {
  const withMemo = [...trials]
    .filter((t) => t.memoPath)
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const blocks: Array<{ text: string }> = [];
  for (const t of withMemo) {
    let content: string;
    try {
      content = (await readFile(join(t.runDir, t.memoPath!), "utf8")).trim();
    } catch {
      console.warn(`⚠️  could not read memo at ${join(t.runDir, t.memoPath!)}`);
      continue;
    }
    if (!content) continue;
    const label = `${t.task} · ${t.variant} · ${t.agentRunner} · ${t.contractPass ? "pass" : "fail"}`;
    blocks.push({ text: `### ${label}\n${content}` });
  }

  const totalCount = blocks.length;
  let droppedCount = 0;
  let total = blocks.reduce((sum, b) => sum + b.text.length, 0);
  // Oldest memos are at the front (ascending startedAt) — drop those first.
  while (total > capChars && blocks.length > 0) {
    const removed = blocks.shift()!;
    total -= removed.text.length;
    droppedCount++;
  }

  return {
    text: blocks.map((b) => b.text).join("\n\n"),
    totalCount,
    includedCount: blocks.length,
    droppedCount,
  };
}

// ─── Model call ──────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are writing the weekly synthesis report for the mcp-use SDK agentic-evals pipeline. Codex builds an MCP server from a natural-language prompt across a fixed task suite. Every trial is graded by a deterministic pass/fail contract check (never a blended 0-100 score); a separate LLM judge then writes one unscored prose memo per trial about where the agent struggled, with every claim backed by a verbatim transcript quote. Your job is to turn the precomputed statistics and the trial memos into a decision-ready report for the mcp-use SDK/docs team.

Hard rules:
- The stats block you are given is computed deterministically in code and is ground truth. Reproduce its numbers verbatim — never recompute, round differently, or "improve" them.
- Every recurring-struggle claim must include an occurrence count derived ONLY from the labeled memos you were given ("appeared in N of M trials") plus exactly one representative verbatim quote copied from a memo.
- Never invent a finding that isn't evidenced in a memo. A struggle seen in only one trial's memo may be mentioned in the narrative, but do not promote it to a "Proposed issues" entry unless it is clearly a deterministic contract defect (a bug regardless of how many trials hit it).
- No 0-100 scores, no penalty language, no weighted/blended metrics anywhere in your writing.

Write the report in exactly this structure:
1. A two-line executive summary in plain prose (no heading) as the very first thing in your response.
2. "## Numbers" — the stats block reproduced verbatim, unchanged.
3. "## Recurring struggles" — themes clustered across memos; each theme states its occurrence count and gives one representative verbatim quote in a blockquote.
4. "## Proposed issues" — a markdown table with columns: title | surface (docs\\|skill\\|sdk\\|template\\|eval-infra) | seen_in | evidence quote | proposed_fix | fixed_when.

Keep prose tight. This is read by engineers deciding what to fix next, not a marketing summary.`;

function buildUserPrompt(statsBlock: string, memos: MemoBundle): string {
  const parts: string[] = [];
  parts.push("## Computed stats (reuse verbatim for every number in your report)\n");
  parts.push(statsBlock);
  parts.push("");
  parts.push(
    `## Trial memos (current window only, ${memos.includedCount}/${memos.totalCount} included${
      memos.droppedCount > 0
        ? `, ${memos.droppedCount} oldest memo(s) dropped to stay under the prompt budget`
        : ""
    })\n`
  );
  parts.push(
    memos.text || "_(no memos in this window — either the judge was skipped or there were no trials)_"
  );
  return parts.join("\n");
}

async function callSynthesisModel(model: string, userPrompt: string): Promise<string> {
  if (model.startsWith("gpt")) {
    const response = await generateText({
      model: openai.responses(model),
      system: SYSTEM_PROMPT,
      prompt: userPrompt,
    });
    return response.text.trim();
  }

  const client = new Anthropic();
  const response = await client.messages.create({
    model,
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });
  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function extractExecutiveSummary(reportBody: string): string {
  const headingIdx = reportBody.search(/\n#{1,3}\s/);
  const summary = headingIdx === -1 ? reportBody : reportBody.slice(0, headingIdx);
  return summary.trim();
}

async function postToSlack(opts: {
  executiveSummary: string;
  current: WindowStats;
  outPath: string;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error(
      "--slack requires SLACK_WEBHOOK_URL to be set in the environment."
    );
  }
  const passRateLine =
    opts.current.scoredTrials > 0
      ? `Pass rate: ${fmtPct(opts.current.passRate)} (${opts.current.passedTrials}/${opts.current.scoredTrials} valid scored trials)`
      : "Pass rate: no valid scored trials in this window";
  let text = [
    opts.executiveSummary,
    "",
    passRateLine,
    `Full report: ${opts.outPath}`,
  ].join("\n");
  if (text.length > SLACK_TEXT_CAP) {
    text = `${text.slice(0, SLACK_TEXT_CAP)}\n\n[truncated]`;
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error(
      `Slack webhook POST failed: ${res.status} ${res.statusText} — ${await res.text().catch(() => "")}`
    );
  }
  console.log("Posted executive summary to Slack.");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      days: { type: "string", default: "7" },
      "results-dir": { type: "string", default: "results" },
      model: { type: "string" },
      out: { type: "string" },
      slack: { type: "boolean", default: false },
      "dry-run": { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
  });

  if (values.help) {
    console.log(HELP);
    return;
  }

  const days = Number(values.days);
  if (!Number.isFinite(days) || days <= 0) {
    throw new Error(`--days must be a positive number, got "${values.days}"`);
  }
  const dryRun = values["dry-run"]!;
  const slackRequested = values.slack!;
  const model = values.model ?? process.env.SYNTHESIS_MODEL ?? DEFAULT_SYNTHESIS_MODEL;
  const resultsDir = resolve(process.cwd(), values["results-dir"]!);

  if (!dryRun) {
    const requiredKey = model.startsWith("gpt")
      ? "OPENAI_API_KEY"
      : "ANTHROPIC_API_KEY";
    if (!process.env[requiredKey]) {
      throw new Error(
        `${requiredKey} is required to call synthesis model "${model}". Pass --dry-run to build the prompt and stats without calling it.`
      );
    }
  }
  if (slackRequested && !dryRun && !process.env.SLACK_WEBHOOK_URL) {
    throw new Error(
      "--slack requires SLACK_WEBHOOK_URL to be set in the environment."
    );
  }

  const now = new Date();
  const windowEnd = now;
  const windowStart = new Date(now.getTime() - days * 86_400_000);
  const prevWindowEnd = windowStart;
  const prevWindowStart = new Date(windowStart.getTime() - days * 86_400_000);

  const runs = await collectRuns(resultsDir);
  const allTrials = flattenTrials(runs);
  const currentTrials = allTrials.filter((t) => inWindow(t.startedAt, windowStart, windowEnd));
  const previousTrials = allTrials.filter((t) =>
    inWindow(t.startedAt, prevWindowStart, prevWindowEnd)
  );

  const current = computeWindowStats(currentTrials);
  const previous = computeWindowStats(previousTrials);
  const statsBlock = renderStatsBlock({
    days,
    windowStart,
    windowEnd,
    prevWindowStart,
    prevWindowEnd,
    current,
    previous,
  });

  console.log(statsBlock);
  console.log(
    `\n${runs.length} run(s) read from ${resultsDir}; ${currentTrials.length} trial(s) in the current window, ${previousTrials.length} in the previous window.`
  );

  if (dryRun) {
    const memos = await collectMemos(currentTrials);
    const userPrompt = buildUserPrompt(statsBlock, memos);
    console.log(
      `\n[dry run] would call model "${model}" with a ${userPrompt.length}-char prompt (${memos.includedCount}/${memos.totalCount} memos, ${memos.droppedCount} dropped). Skipping the model call.`
    );
    return;
  }

  const memos = await collectMemos(currentTrials);
  const userPrompt = buildUserPrompt(statsBlock, memos);
  const reportBody = await callSynthesisModel(model, userPrompt);

  const outPath = values.out ?? join("results", "synthesis", `${fmtDate(now)}.md`);
  const resolvedOutPath = resolve(process.cwd(), outPath);
  await mkdir(dirname(resolvedOutPath), { recursive: true });
  const fullReport = [
    reportBody,
    "",
    "---",
    "",
    "## Appendix: computed stats (source of truth, generated in code)",
    "",
    statsBlock,
  ].join("\n");
  await writeFile(resolvedOutPath, fullReport, "utf8");
  console.log(`\nWrote synthesis report to ${resolvedOutPath}`);

  if (slackRequested) {
    await postToSlack({
      executiveSummary: extractExecutiveSummary(reportBody),
      current,
      outPath: resolvedOutPath,
    });
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
