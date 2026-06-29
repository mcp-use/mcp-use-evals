import type {
  Finding,
  ReadinessPenalty,
  RunResult,
  TrialResult,
} from "./types.js";

interface CellAgg {
  trials: TrialResult[];
  functionalSuccesses: number;
  readiness: number;
  penaltyTrials: number;
  costUsd: number | null;
  turns: number | null;
}

function aggregate(trials: TrialResult[]): CellAgg {
  return {
    trials,
    functionalSuccesses: trials.filter((t) => t.readiness.functionalSuccess)
      .length,
    readiness: mean(trials.map((t) => t.readiness.score)),
    penaltyTrials: trials.filter((t) => t.readiness.penalties.length > 0)
      .length,
    costUsd: meanFloatNullable(trials.map((t) => t.costUsd)),
    turns: meanNullable(trials.map((t) => t.turns)),
  };
}

function mean(xs: number[]): number {
  return xs.length === 0
    ? 0
    : Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
}

function meanNullable(xs: Array<number | null>): number | null {
  const present = xs.filter((x): x is number => x !== null);
  return present.length === 0 ? null : mean(present);
}

function meanFloatNullable(xs: Array<number | null>): number | null {
  const present = xs.filter((x): x is number => x !== null);
  return present.length === 0
    ? null
    : present.reduce((a, b) => a + b, 0) / present.length;
}

function groupBy<T>(items: T[], key: (item: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    map.set(k, [...(map.get(k) ?? []), item]);
  }
  return map;
}

export function renderReport(run: RunResult): string {
  const lines: string[] = [];
  const sdkVersions = [
    ...new Set(run.trials.map((t) => t.sdkVersion).filter(Boolean)),
  ];
  lines.push(
    `# SDK Readiness Eval - ${run.startedAt.slice(0, 10)} · mcp-use@${sdkVersions.join("/") || "?"} (npm) · agent: ${run.agentRunner}${run.agentModel !== "default" ? `/${run.agentModel}` : ""} · judge: ${run.judgeModel}`,
    "",
    `Run \`${run.runId}\` - ${run.trials.length} trial(s).`,
    ""
  );

  lines.push(
    "## Summary",
    "",
    "| Task | Variant | Functional | Readiness | Penalties | Cost | Turns |",
    "|---|---|---|---|---|---|---|"
  );
  const byTaskVariant = groupBy(
    run.trials,
    (t) => `${t.task}::variant::${t.variant}`
  );
  for (const [key, trials] of [...byTaskVariant.entries()].sort()) {
    const [task, variant] = key.split("::variant::");
    const agg = aggregate(trials);
    const icon =
      agg.functionalSuccesses === trials.length
        ? "✅"
        : agg.functionalSuccesses > 0
          ? "⚠️"
          : "❌";
    lines.push(
      `| ${task} | ${variant} | ${agg.functionalSuccesses}/${trials.length} ${icon} | ${agg.readiness} | ${agg.penaltyTrials}/${trials.length} trials | ${agg.costUsd != null ? `$${agg.costUsd.toFixed(2)}` : "-"} | ${agg.turns ?? "-"} |`
    );
  }
  lines.push("");

  const byTask = groupBy(run.trials, (t) => t.task);
  const variantsInRun = new Set(run.trials.map((t) => t.variant));
  if (variantsInRun.size > 1) {
    lines.push("## Variant Matrix (Mean Readiness)", "");
    for (const [task, trials] of [...byTask.entries()].sort()) {
      const cell = (variant: string) => {
        const scores = trials
          .filter((t) => t.variant === variant)
          .map((t) => t.readiness.score);
        return scores.length === 0 ? "-" : String(mean(scores));
      };
      const hasDocsVariants = trials.some((t) =>
        t.variant.startsWith("blank+docs-")
      );
      if (hasDocsVariants) {
        lines.push(
          `### ${task}`,
          "",
          "|  | blank | scaffold | docs old | docs new |",
          "|---|---|---|---|---|"
        );
        lines.push(
          `| no skill | ${cell("noskill+blank")} | ${cell("noskill+scaffold")} | ${cell("blank+docs-old")} | ${cell("blank+docs-new")} |`
        );
        lines.push(
          `| skill | ${cell("skill+blank")} | ${cell("skill+scaffold")} | - | - |`
        );
      } else {
        lines.push(
          `### ${task}`,
          "",
          "|  | blank | scaffold |",
          "|---|---|---|"
        );
        lines.push(
          `| no skill | ${cell("noskill+blank")} | ${cell("noskill+scaffold")} |`
        );
        lines.push(
          `| skill | ${cell("skill+blank")} | ${cell("skill+scaffold")} |`
        );
      }
      const deltas = variantDeltas(trials);
      if (deltas) lines.push("", deltas);
      lines.push("");
    }
  }

  const docsComparison = renderDocsComparison(run.trials);
  if (docsComparison.length > 0) {
    lines.push(...docsComparison);
  }

  const penalties = collectReadinessPenalties(run.trials);
  lines.push("## Top Readiness Penalties", "");
  if (penalties.length === 0) {
    lines.push("None detected - no readiness penalties fired.", "");
  } else {
    penalties.forEach((p, i) => {
      lines.push(
        `${i + 1}. **\`${p.detector}\`** - ${p.count}/${run.trials.length} trials · ${p.points} pts · lever: ${p.lever} · source: ${p.source}`
      );
      lines.push(`   e.g. ${p.sample}`);
    });
    lines.push("");
  }

  const judgeFindings = collectJudgeFindings(run.trials);
  if (judgeFindings.length > 0) {
    lines.push("## Judge Discovery Findings", "");
    judgeFindings.forEach((n, i) => {
      lines.push(
        `${i + 1}. **\`${n.detector}\`** - ${n.count}/${run.trials.length} trials · lever: ${n.lever}`
      );
      lines.push(`   e.g. ${n.sample}`);
    });
    lines.push("");
  }

  lines.push("## Trial Detail", "");
  for (const [task, trials] of [...byTask.entries()].sort()) {
    lines.push(`### ${task}`, "");
    lines.push(
      "| Variant | Trial | compiles | imports | starts | auth | tools | resources | calls | Readiness | Penalties | Judge criteria | Cost | Turns | Transcript |",
      "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"
    );
    for (const t of trials) {
      const mark = (id: string) => {
        const c = t.readiness.checks.find((c) => c.id === id);
        return c === undefined ? "-" : c.passed ? "✅" : "❌";
      };
      const penalties = [...new Set(t.readiness.penalties.map((p) => p.detector))]
        .map((d) => `\`${d}\``)
        .join("<br>");
      const judgeCriteria = (t.readiness.judge?.criteria ?? [])
        .filter((c) => c.verdict !== "yes")
        .map((c) => `\`${c.id}:${c.verdict}\``)
        .join("<br>");
      lines.push(
        `| ${t.variant} | ${t.trial} | ${mark("compiles")} | ${mark("imports")} | ${mark("starts")} | ${mark("auth")} | ${mark("tools")} | ${mark("resources")} | ${mark("calls")} | ${t.readiness.score} | ${penalties || "-"} | ${judgeCriteria || "-"} | ${t.costUsd != null ? `$${t.costUsd.toFixed(2)}` : "-"} | ${t.turns ?? "-"} | ${t.transcriptPath ?? "-"} |`
      );
    }

    const failures = trials.flatMap((t) =>
      t.readiness.checks
        .filter((c) => !c.passed && c.detail)
        .map(
          (c) =>
            `- \`${t.variant}\` trial ${t.trial} · **${c.id}**: ${c.detail}`
        )
    );
    if (failures.length > 0)
      lines.push(
        "",
        "<details><summary>Functional check details</summary>",
        "",
        ...failures,
        "",
        "</details>"
      );
    if (trials.some((t) => t.error)) {
      lines.push(
        "",
        ...trials
          .filter((t) => t.error)
          .map(
            (t) =>
              `- ⚠️ \`${t.variant}\` trial ${t.trial} harness error: ${t.error}`
          )
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function variantDeltas(trials: TrialResult[]): string | null {
  const readiness = (pred: (t: TrialResult) => boolean) => {
    const subset = trials.filter(pred);
    return subset.length === 0
      ? null
      : mean(subset.map((t) => t.readiness.score));
  };
  const skillOn = readiness((t) => t.variant.startsWith("skill+"));
  const skillOff = readiness((t) => t.variant.startsWith("noskill+"));
  const scaffoldOn = readiness((t) => t.variant.endsWith("+scaffold"));
  const scaffoldOff = readiness((t) => t.variant.endsWith("+blank"));
  const blank = readiness((t) => t.variant === "noskill+blank");
  const docsOld = readiness((t) => t.variant === "blank+docs-old");
  const docsNew = readiness((t) => t.variant === "blank+docs-new");
  const parts: string[] = [];
  if (skillOn !== null && skillOff !== null)
    parts.push(`Skill readiness uplift: ${signed(skillOn - skillOff)}`);
  if (scaffoldOn !== null && scaffoldOff !== null)
    parts.push(`Scaffold readiness uplift: ${signed(scaffoldOn - scaffoldOff)}`);
  if (blank !== null && docsOld !== null)
    parts.push(`Old docs uplift vs blank: ${signed(docsOld - blank)}`);
  if (blank !== null && docsNew !== null)
    parts.push(`New docs uplift vs blank: ${signed(docsNew - blank)}`);
  if (docsOld !== null && docsNew !== null)
    parts.push(`New docs uplift vs old docs: ${signed(docsNew - docsOld)}`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

function signed(delta: number): string {
  const value = Math.round(delta);
  return `${value >= 0 ? "+" : ""}${value}`;
}

function renderDocsComparison(trials: TrialResult[]): string[] {
  const byTask = groupBy(trials, (t) => t.task);
  const rows: string[] = [];

  for (const [task, taskTrials] of [...byTask.entries()].sort()) {
    const blank = taskTrials.filter((t) => t.variant === "noskill+blank");
    const oldDocs = taskTrials.filter((t) => t.variant === "blank+docs-old");
    const newDocs = taskTrials.filter((t) => t.variant === "blank+docs-new");
    if (oldDocs.length === 0 || newDocs.length === 0) continue;

    const blankReadiness = blank.length > 0 ? mean(blank.map(score)) : null;
    const oldReadiness = mean(oldDocs.map(score));
    const newReadiness = mean(newDocs.map(score));
    const oldFunctional = functionalRate(oldDocs);
    const newFunctional = functionalRate(newDocs);

    rows.push(
      `| ${task} | ${formatNullableScore(blankReadiness)} | ${oldReadiness} | ${newReadiness} | ${signed(newReadiness - oldReadiness)} | ${blankReadiness === null ? "-" : signed(newReadiness - blankReadiness)} | ${signed(newFunctional - oldFunctional)}pp | ${formatPenaltyDeltas(oldDocs, newDocs)} |`
    );
  }

  if (rows.length === 0) return [];
  return [
    "## Docs Comparison",
    "",
    "| Task | Blank | Old docs | New docs | New vs old | New vs blank | Functional delta | Top changed penalties |",
    "|---|---:|---:|---:|---:|---:|---:|---|",
    ...rows,
    "",
  ];
}

function score(t: TrialResult): number {
  return t.readiness.score;
}

function formatNullableScore(score: number | null): string {
  return score === null ? "-" : String(score);
}

function functionalRate(trials: TrialResult[]): number {
  if (trials.length === 0) return 0;
  return Math.round(
    (trials.filter((t) => t.readiness.functionalSuccess).length /
      trials.length) *
      100
  );
}

function formatPenaltyDeltas(
  oldDocs: TrialResult[],
  newDocs: TrialResult[]
): string {
  const oldCounts = penaltyHitCounts(oldDocs);
  const newCounts = penaltyHitCounts(newDocs);
  const detectors = new Set([...oldCounts.keys(), ...newCounts.keys()]);
  const deltas = [...detectors]
    .map((detector) => ({
      detector,
      delta: (newCounts.get(detector) ?? 0) - (oldCounts.get(detector) ?? 0),
    }))
    .filter((d) => d.delta !== 0)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 3);

  if (deltas.length === 0) return "none";
  return deltas
    .map((d) => `\`${d.detector}\` ${signed(d.delta)}`)
    .join("<br>");
}

function penaltyHitCounts(trials: TrialResult[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const trial of trials) {
    const detectors = new Set(trial.readiness.penalties.map((p) => p.detector));
    for (const detector of detectors) {
      counts.set(detector, (counts.get(detector) ?? 0) + 1);
    }
  }
  return counts;
}

interface PenaltyAgg {
  detector: string;
  count: number;
  points: number;
  lever: string;
  source: string;
  sample: string;
}

export function collectReadinessPenalties(
  trials: TrialResult[]
): PenaltyAgg[] {
  const byDetector = new Map<
    string,
    {
      trialIds: Set<string>;
      lever: string;
      points: number;
      source: string;
      sample: ReadinessPenalty;
    }
  >();
  for (const t of trials) {
    const trialId = `${t.task}/${t.variant}/${t.trial}`;
    for (const p of t.readiness.penalties) {
      const entry = byDetector.get(p.detector) ?? {
        trialIds: new Set<string>(),
        lever: p.lever,
        points: p.points,
        source: p.source,
        sample: p,
      };
      entry.trialIds.add(trialId);
      byDetector.set(p.detector, entry);
    }
  }
  return [...byDetector.entries()]
    .map(([detector, e]) => ({
      detector,
      count: e.trialIds.size,
      points: e.points,
      lever: e.lever,
      source: e.source,
      sample: e.sample.file
        ? `${e.sample.file}:${e.sample.line ?? "?"} - ${e.sample.evidence}`
        : e.sample.evidence,
    }))
    .sort((a, b) => b.count - a.count);
}

export function collectJudgeFindings(
  trials: TrialResult[]
): Omit<PenaltyAgg, "points" | "source">[] {
  const byDetector = new Map<
    string,
    { trialIds: Set<string>; lever: string; sample: Finding }
  >();
  for (const t of trials) {
    const trialId = `${t.task}/${t.variant}/${t.trial}`;
    for (const f of t.readiness.judge?.findings ?? []) {
      const entry = byDetector.get(f.detector) ?? {
        trialIds: new Set<string>(),
        lever: f.lever,
        sample: f,
      };
      entry.trialIds.add(trialId);
      byDetector.set(f.detector, entry);
    }
  }
  return [...byDetector.entries()]
    .map(([detector, e]) => ({
      detector,
      count: e.trialIds.size,
      lever: e.lever,
      sample: e.sample.file
        ? `${e.sample.file}:${e.sample.line ?? "?"} - ${e.sample.evidence}`
        : e.sample.evidence,
    }))
    .sort((a, b) => b.count - a.count);
}

export function consoleSummary(run: RunResult): string {
  const lines: string[] = [];
  const byTaskVariant = groupBy(run.trials, (t) => `${t.task} · ${t.variant}`);
  for (const [key, trials] of [...byTaskVariant.entries()].sort()) {
    const agg = aggregate(trials);
    lines.push(
      `${key}: readiness ${agg.readiness} · functional ${agg.functionalSuccesses}/${trials.length} · penalties in ${agg.penaltyTrials}/${trials.length} trials`
    );
  }
  return lines.join("\n");
}
