import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { RESULTS_DIR } from "./tasks.js";
import { TrendRunSchema, type TrendRun } from "./types.js";

/** One results/<dir>/run.json read off disk (or null if it doesn't exist). */
export interface RawRunFile {
  dir: string;
  raw: string | null;
}

/**
 * Parse each raw run.json into a TrendRun, skipping — with a one-line warning
 * — anything that isn't valid JSON or doesn't match the v2 shape. Pre-v2 run
 * dirs (which wrote `readiness` instead of `grade`) simply fail the schema
 * and are skipped the same way.
 */
export function collectRuns(files: RawRunFile[]): TrendRun[] {
  const runs: TrendRun[] = [];
  for (const { dir, raw } of files) {
    if (raw === null) continue; // no run.json — incomplete or foreign dir, skip quietly
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      console.warn(`⚠️  skipping ${dir}: run.json is not valid JSON`);
      continue;
    }
    const parsed = TrendRunSchema.safeParse(json);
    if (!parsed.success) {
      console.warn(`⚠️  skipping ${dir}: run.json is not a valid v2 run result`);
      continue;
    }
    runs.push(parsed.data);
  }
  return runs.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}

function passFraction(trials: TrendRun["trials"]): { passed: number; total: number } {
  const scored = trials.filter(
    (t) => t.valid !== false && t.grade.scoredForPassRate !== false
  );
  return {
    passed: scored.filter((t) => t.grade.contractPass).length,
    total: scored.length,
  };
}

/**
 * Markdown trend table: one row per run — date, agent, pass rate (fraction),
 * invalid-trial count — plus one column per condition seen across the window.
 * No penalty-rate table: penalties don't exist in v2.
 */
export function renderTrendsTable(runs: TrendRun[]): string {
  if (runs.length === 0) return "No completed runs found.";

  const variants = new Set<string>();
  for (const run of runs) for (const t of run.trials) variants.add(t.variant);
  const variantCols = [...variants].sort();

  const header = ["Run date", "Agent", "Pass rate", "Invalid", ...variantCols];
  const rows: string[][] = [header, header.map(() => "---")];
  for (const run of runs) {
    const { passed, total } = passFraction(run.trials);
    const invalid = run.trials.filter((t) => t.valid === false).length;
    const variantCells = variantCols.map((variant) => {
      const cell = passFraction(run.trials.filter((t) => t.variant === variant));
      return cell.total === 0 ? "-" : `${cell.passed}/${cell.total}`;
    });
    rows.push([
      run.startedAt.slice(0, 10),
      run.agentRunner ?? "-",
      `${passed}/${total}`,
      String(invalid),
      ...variantCells,
    ]);
  }
  return rows.map((r) => `| ${r.join(" | ")} |`).join("\n");
}

async function main(): Promise<void> {
  let dirNames: string[];
  try {
    dirNames = (await readdir(RESULTS_DIR, { withFileTypes: true }))
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    console.log("No results yet — run `pnpm eval` first.");
    return;
  }

  const files: RawRunFile[] = await Promise.all(
    dirNames.map(async (dir) => {
      try {
        return { dir, raw: await readFile(join(RESULTS_DIR, dir, "run.json"), "utf8") };
      } catch {
        return { dir, raw: null };
      }
    })
  );

  console.log(renderTrendsTable(collectRuns(files)));
}

// Only run the CLI when this file is the entry point (e.g. `tsx src/trends.ts`),
// so importing the pure helpers above for tests never touches the filesystem.
const isEntryPoint =
  process.argv[1] !== undefined &&
  import.meta.url === `file://${process.argv[1]}`;
if (isEntryPoint) {
  main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
}
