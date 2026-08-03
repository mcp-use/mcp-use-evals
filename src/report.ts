import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RESULTS_DIR } from "./tasks.js";
import type { RunResult, TrialResult } from "./types.js";

// ─── Small pure helpers ─────────────────────────────────────────────────────

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    map.set(k, [...(map.get(k) ?? []), item]);
  }
  return map;
}

function median(xs: Array<number | null>): number | null {
  const present = xs
    .filter((x): x is number => x !== null)
    .sort((a, b) => a - b);
  if (present.length === 0) return null;
  const mid = Math.floor(present.length / 2);
  return present.length % 2 === 0
    ? (present[mid - 1]! + present[mid]!) / 2
    : present[mid]!;
}

function sumNullable(xs: Array<number | null>): number | null {
  const present = xs.filter((x): x is number => x !== null);
  return present.length === 0 ? null : present.reduce((a, b) => a + b, 0);
}

function pct(passed: number, total: number): number {
  return total === 0 ? 0 : Math.round((passed / total) * 100);
}

function signedPP(delta: number): string {
  return `${delta >= 0 ? "+" : ""}${delta}pp`;
}

function formatMs(ms: number | null): string {
  if (ms === null) return "-";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}m${String(s).padStart(2, "0")}s`;
}

/** Trials that count toward the headline pass rate: ran, and not a static task. */
function scoredValidTrials(trials: TrialResult[]): TrialResult[] {
  return trials.filter((t) => t.valid && t.grade.scoredForPassRate);
}

/**
 * First non-blank line of a trial's memo, read from disk relative to the run
 * directory (memoPath mirrors the transcriptPath convention: relative to
 * `results/<runId>/`). Defensive: any read/parse failure just means no
 * excerpt is shown — the report never breaks because a memo is missing.
 */
function readMemoFirstLine(runId: string, memoPath: string): string | null {
  try {
    const text = readFileSync(join(RESULTS_DIR, runId, memoPath), "utf8");
    return (
      text
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0) ?? null
    );
  } catch {
    return null;
  }
}

// ─── Report sections ────────────────────────────────────────────────────────

export function renderReport(run: RunResult): string {
  const lines: string[] = [];
  const scored = scoredValidTrials(run.trials);
  const passed = scored.filter((t) => t.grade.contractPass);

  lines.push(
    `# mcp-use SDK agentic eval — ${run.startedAt.slice(0, 10)}`,
    "",
    `Run \`${run.runId}\` · batch \`${run.batchId}\` · agent: ${run.agentRunner}${run.agentModel !== "default" ? `/${run.agentModel}` : ""} · judge: ${run.judgeModel} · grader ${run.manifest.graderVersion} · sandbox ${run.manifest.sandbox} · ${run.trials.length} trial(s)`,
    "",
    `## Pass rate: ${pct(passed.length, scored.length)}% (${passed.length}/${scored.length} valid scored trials)`,
    ""
  );

  lines.push(...renderMatrix(run.trials));
  const passK = renderPassK(scored);
  if (passK) lines.push(...passK);

  const deltas = renderDeltas(scored);
  if (deltas.length > 0) lines.push("## Deltas", "", ...deltas, "");

  lines.push(...renderPerformance(run.trials));
  lines.push(...renderFailureBreakdown(run.trials));
  lines.push(...renderSdkPaths(run.trials));
  lines.push(...renderMemos(run));

  return lines.join("\n");
}

function renderMatrix(trials: TrialResult[]): string[] {
  const lines: string[] = ["## Matrix", ""];
  const scored = trials.filter((t) => t.valid && t.grade.scoredForPassRate);
  const staticTrials = trials.filter((t) => t.valid && !t.grade.scoredForPassRate);

  lines.push("| Task | Condition | Passes/Trials |", "|---|---|---|");
  for (const [key, ts] of sortedCells(scored)) {
    const [task, variant] = key.split("::");
    lines.push(
      `| ${task} | ${variant} | ${ts.filter((t) => t.grade.contractPass).length}/${ts.length} |`
    );
  }
  lines.push("");

  if (staticTrials.length > 0) {
    lines.push("### Static adoption tasks (not in pass rate)", "");
    lines.push("| Task | Condition | Passes/Trials |", "|---|---|---|");
    for (const [key, ts] of sortedCells(staticTrials)) {
      const [task, variant] = key.split("::");
      lines.push(
        `| ${task} | ${variant} | ${ts.filter((t) => t.grade.contractPass).length}/${ts.length} |`
      );
    }
    lines.push("");
  }
  return lines;
}

function sortedCells(trials: TrialResult[]): Array<[string, TrialResult[]]> {
  const cells = groupBy(trials, (t) => `${t.task}::${t.variant}`);
  return [...cells.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/**
 * pass^k: when every task×condition cell has ≥2 scored trials, the fraction of
 * cells where ALL of that cell's trials passed — a much harsher bar than the
 * headline per-trial pass rate. k is the smallest trial count across cells.
 */
function renderPassK(scored: TrialResult[]): string[] | null {
  const cells = [...groupBy(scored, (t) => `${t.task}::${t.variant}`).values()];
  if (cells.length === 0) return null;
  const k = Math.min(...cells.map((ts) => ts.length));
  if (k < 2) return null;
  const allPass = cells.filter((ts) => ts.every((t) => t.grade.contractPass)).length;
  return [
    "## pass^k",
    "",
    `pass^${k}: ${pct(allPass, cells.length)}% (${allPass}/${cells.length} task×condition cells all-pass, min ${k} trials/cell)`,
    "",
  ];
}

/** Paired skill/no-skill pass-rate deltas, run-wide. */
function renderDeltas(scored: TrialResult[]): string[] {
  const rate = (pred: (t: TrialResult) => boolean) => {
    const subset = scored.filter(pred);
    if (subset.length === 0) return null;
    const passed = subset.filter((t) => t.grade.contractPass).length;
    return { pct: pct(passed, subset.length), passed, total: subset.length };
  };
  const pairs: Array<[string, string, (t: TrialResult) => boolean, (t: TrialResult) => boolean]> = [
    ["skill+blank", "noskill+blank", (t) => t.variant === "skill+blank", (t) => t.variant === "noskill+blank"],
    ["skill+scaffold", "noskill+scaffold", (t) => t.variant === "skill+scaffold", (t) => t.variant === "noskill+scaffold"],
  ];
  const lines: string[] = [];
  for (const [aLabel, bLabel, aPred, bPred] of pairs) {
    const a = rate(aPred);
    const b = rate(bPred);
    if (a === null || b === null) continue;
    lines.push(
      `- **${aLabel} vs ${bLabel}**: ${signedPP(a.pct - b.pct)} (${a.passed}/${a.total} vs ${b.passed}/${b.total})`
    );
  }
  return lines;
}

/** Duration/turns/toolCalls/tokens are only meaningful for trials that actually completed. */
function renderPerformance(trials: TrialResult[]): string[] {
  const lines = ["## Performance (passing trials)", ""];
  const passing = trials.filter((t) => t.valid && t.grade.contractPass);
  if (passing.length === 0) {
    lines.push("No passing trials.", "");
    return lines;
  }

  const totalCost = sumNullable(trials.map((t) => t.perf.costUsd));
  const anyCostMissing = trials.some((t) => t.perf.costUsd === null);
  const costPerSuccess = totalCost === null ? null : totalCost / passing.length;

  lines.push(
    `- Median duration: ${formatMs(median(passing.map((t) => t.perf.durationMs)))}`,
    `- Median turns: ${median(passing.map((t) => t.perf.turns)) ?? "-"}`,
    `- Median tool calls: ${median(passing.map((t) => t.perf.toolCalls)) ?? "-"}`,
    `- Median tokens in/out: ${median(passing.map((t) => t.perf.tokensIn)) ?? "-"} / ${median(passing.map((t) => t.perf.tokensOut)) ?? "-"}`,
    `- Total cost: ${totalCost === null ? "-" : `$${totalCost.toFixed(2)}`}${anyCostMissing ? " (some trials missing cost)" : ""}`,
    `- Cost per success: ${costPerSuccess === null ? "-" : `$${costPerSuccess.toFixed(2)}`}`,
    ""
  );
  return lines;
}

/** contract.* counts against the pass rate; infra.* trials are invalid and excluded from it. */
function renderFailureBreakdown(trials: TrialResult[]): string[] {
  const lines = ["## Failure breakdown", ""];
  const contractCounts = new Map<string, number>();
  for (const t of trials) {
    const code = t.grade.failureCode;
    if (code?.startsWith("contract.")) {
      contractCounts.set(code, (contractCounts.get(code) ?? 0) + 1);
    }
  }
  if (contractCounts.size === 0) {
    lines.push("No contract failures.", "");
  } else {
    for (const [code, count] of [...contractCounts.entries()].sort((a, b) => b[1] - a[1])) {
      lines.push(`- \`${code}\`: ${count}`);
    }
    lines.push("");
  }

  const invalid = trials.filter((t) => !t.valid);
  lines.push(`Invalid trials: ${invalid.length}`, "");
  const infraCounts = new Map<string, number>();
  for (const t of invalid) {
    const code = t.grade.failureCode;
    if (code?.startsWith("infra.")) {
      infraCounts.set(code, (infraCounts.get(code) ?? 0) + 1);
    }
  }
  for (const [code, count] of [...infraCounts.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`- \`${code}\`: ${count}`);
  }
  if (infraCounts.size > 0) lines.push("");
  return lines;
}

/** sdkPath is a recorded fact, never a score — reported as plain counts. */
function renderSdkPaths(trials: TrialResult[]): string[] {
  const lines = ["## SDK path", ""];
  const counts = new Map<string, number>();
  for (const t of trials) counts.set(t.grade.sdkPath, (counts.get(t.grade.sdkPath) ?? 0) + 1);
  for (const [path, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
    lines.push(`- \`${path}\`: ${count}`);
  }
  lines.push("");
  return lines;
}

/** Every failed trial, plus any passing trial whose memo found something worth reading. */
function renderMemos(run: RunResult): string[] {
  const lines = ["## Memos", ""];
  const withMemos = run.trials.filter(
    (t): t is TrialResult & { memoPath: string } => t.memoPath !== null
  );
  const relevant = withMemos
    .map((t) => ({ trial: t, excerpt: readMemoFirstLine(run.runId, t.memoPath) }))
    .filter(({ trial, excerpt }) => {
      if (trial.valid && !trial.grade.contractPass) return true;
      return excerpt !== null && excerpt !== "Nothing notable.";
    });

  if (relevant.length === 0) {
    lines.push("No notable memos.", "");
    return lines;
  }
  for (const { trial, excerpt } of relevant) {
    lines.push(
      `- \`${trial.task}\` · \`${trial.variant}\` · trial ${trial.trial} — [${trial.memoPath}](${trial.memoPath})${excerpt ? `: ${excerpt}` : ""}`
    );
  }
  lines.push("");
  return lines;
}

export function consoleSummary(run: RunResult): string {
  const scored = scoredValidTrials(run.trials);
  const passed = scored.filter((t) => t.grade.contractPass);
  const lines: string[] = [
    `Pass rate: ${pct(passed.length, scored.length)}% (${passed.length}/${scored.length} valid scored trials)`,
  ];
  for (const [key, ts] of sortedCells(scored)) {
    const [task, variant] = key.split("::");
    lines.push(`  ${task} · ${variant}: ${ts.filter((t) => t.grade.contractPass).length}/${ts.length}`);
  }
  const invalid = run.trials.filter((t) => !t.valid).length;
  if (invalid > 0) lines.push(`Invalid trials: ${invalid}`);
  return lines.join("\n");
}
