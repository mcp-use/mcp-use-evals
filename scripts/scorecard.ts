/**
 * Scorecard aggregator. Scans results/, pulls each run's `result.analysis.readiness`,
 * and prints three things, in order of importance:
 *
 *   1. HEADLINE — one row per (scenario × agent) with the three numbers that matter:
 *        • pass    — how many runs produced a server the MCP-client probe could
 *                    connect to and list tools on (OAuth: boot + 401). `—` = not
 *                    measured (pre-probe runs / probe crashed).
 *        • readiness — mean 0–100 readiness score.
 *        • skill Δ — readiness with the skill vs. without it (scaffold held off):
 *                    the isolated effect of the mcp-use skill.
 *   2. JUDGE NOTES — the LLM judge's prose per run (the richest signal), tagged with
 *        the variant + its pass/readiness.
 *   3. SDK DEFECTS — the compact release-blocker worklist (sdk-lever findings).
 *
 * Reproducible: re-run any time over existing results — it never re-runs agents.
 * Run with `npm run scorecard` (Node strips the TS types).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ReadinessResult, Severity } from '../scoring/types.js';

const RESULTS_DIR = join(process.cwd(), 'results');
const SEV_RANK: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry === 'result.json') out.push(full);
  }
  return out;
}

function loadReadiness(): ReadinessResult[] {
  const results: ReadinessResult[] = [];
  for (const file of walk(RESULTS_DIR)) {
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf-8')) as {
        analysis?: { readiness?: ReadinessResult };
      };
      const r = parsed.analysis?.readiness;
      if (r && typeof r.score === 'number' && r.meta) results.push(r);
    } catch {
      /* skip unreadable/legacy result.json */
    }
  }
  return results;
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}
function padL(s: string, n: number): string {
  return s.length >= n ? s : ' '.repeat(n - s.length) + s;
}
/** Word-wrap `text` to `width` columns, prefixing every line with `indent`. */
function wrap(text: string, width: number, indent: string): string {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      if (line && line.length + 1 + word.length > width) {
        lines.push(indent + line);
        line = word;
      } else {
        line = line ? `${line} ${word}` : word;
      }
    }
    lines.push(indent + line);
  }
  return lines.join('\n');
}
/** A run "measured" functional iff its probe actually ran (marker parsed). */
function measured(r: ReadinessResult): boolean {
  return r.probe?.measured === true;
}
function fmtUsd(n: number): string {
  return `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`;
}
function fmtTok(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
  return String(Math.round(n));
}
/** Mean USD over the runs that were priced; null when none were. */
function meanCost(runs: ReadinessResult[]): number | null {
  const xs = runs.filter((r) => r.cost?.priced && typeof r.cost.usd === 'number').map((r) => r.cost!.usd!);
  return xs.length ? mean(xs) : null;
}

function main(): void {
  const results = loadReadiness();
  if (results.length === 0) {
    console.log(`No readiness results found under ${RESULTS_DIR}.`);
    console.log('Run an experiment first, e.g. `npx agent-eval blank-cc`.');
    return;
  }

  const configVersions = [...new Set(results.map((r) => r.meta.configVersion))].sort();
  console.log(`\n=== Readiness scorecard (${results.length} runs · ${configVersions.join(', ')}) ===\n`);
  console.log('  pass = MCP-client probe connected + listed tools (OAuth: boot + 401). `—` = not measured.');
  console.log('  skill Δ = readiness with skill vs. blank (scaffold held off).');
  console.log('  cost = mean estimated USD/run (token usage × pricing.ts rates; informational, not scored). `—` = unpriced/no usage.');
  if (configVersions.length > 1) {
    console.log('  ⚠ mixed configVersions: pre-probe (v0.1) runs exclude the 40-pt functional dim — re-run for like-for-like.');
  }

  // --- 1. HEADLINE: per (scenario × agent) ---
  interface Cell {
    scenario: string;
    agent: string;
    runs: ReadinessResult[];
  }
  const byScenAgent = new Map<string, Cell>();
  for (const r of results) {
    const agent = r.meta.variant.agentLabel;
    const key = `${r.meta.scenario}::${agent}`;
    let c = byScenAgent.get(key);
    if (!c) {
      c = { scenario: r.meta.scenario, agent, runs: [] };
      byScenAgent.set(key, c);
    }
    c.runs.push(r);
  }

  const cells = [...byScenAgent.values()].sort(
    (a, b) => a.scenario.localeCompare(b.scenario) || a.agent.localeCompare(b.agent),
  );

  const skillDelta = (c: Cell): number | null => {
    const meanOf = (skill: boolean, scaffold: boolean): number | null => {
      const xs = c.runs
        .filter((r) => r.meta.variant.skill === skill && r.meta.variant.scaffold === scaffold)
        .map((r) => r.score);
      return xs.length ? mean(xs) : null;
    };
    const withSkill = meanOf(true, false);
    const blank = meanOf(false, false);
    return withSkill !== null && blank !== null ? withSkill - blank : null;
  };

  console.log(
    `\n${pad('scenario', 24)} ${pad('agent', 7)} ${pad('pass', 7)} ${pad('readiness', 10)} ${pad('cost', 8)} skillΔ`,
  );
  console.log('─'.repeat(72));
  for (const c of cells) {
    const m = c.runs.filter(measured);
    const passed = m.filter((r) => r.functionalPassed).length;
    const passStr = m.length ? `${passed}/${m.length}` : '—';
    const rd = mean(c.runs.map((r) => r.score)).toFixed(1);
    const mc = meanCost(c.runs);
    const costStr = mc === null ? '—' : fmtUsd(mc);
    const d = skillDelta(c);
    const dStr = d === null ? '—' : `${d >= 0 ? '+' : ''}${d.toFixed(1)}`;
    console.log(
      `${pad(c.scenario, 24)} ${pad(c.agent, 7)} ${pad(passStr, 7)} ${padL(rd, 9)}  ${pad(costStr, 8)} ${dStr}`,
    );
  }

  // --- 1a. BY AGENT: mean readiness rolled up across all scenarios/variants ---
  const byAgent = new Map<string, ReadinessResult[]>();
  for (const r of results) {
    const agent = r.meta.variant.agentLabel;
    const runs = byAgent.get(agent) ?? [];
    runs.push(r);
    byAgent.set(agent, runs);
  }
  const agents = [...byAgent.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  if (agents.length) {
    console.log(`\n${pad('by agent', 24)} ${pad('runs', 7)} ${pad('pass', 7)} ${pad('readiness', 10)} cost`);
    console.log('─'.repeat(72));
    for (const [agent, runs] of agents) {
      const m = runs.filter(measured);
      const passed = m.filter((r) => r.functionalPassed).length;
      const passStr = m.length ? `${passed}/${m.length}` : '—';
      const rd = mean(runs.map((r) => r.score)).toFixed(1);
      const mc = meanCost(runs);
      const costStr = mc === null ? '—' : fmtUsd(mc);
      console.log(
        `${pad(agent, 24)} ${pad(String(runs.length), 7)} ${pad(passStr, 7)} ${padL(rd, 9)}  ${costStr}`,
      );
    }
  }

  // --- 1b. COST (estimated; informational, never part of the score) ---
  if (results.some((r) => r.cost?.measured)) {
    console.log(`\n\n=== Cost (estimated · USD · not part of the score) ===\n`);
    console.log(
      `${pad('scenario', 24)} ${pad('agent', 7)} ${pad('runs', 5)} ${pad('mean $', 9)} ${pad('in', 8)} ${pad('cached', 8)} ${pad('out', 8)}`,
    );
    console.log('─'.repeat(74));
    const meanTok = (rs: ReadinessResult[], sel: (c: NonNullable<ReadinessResult['cost']>) => number) =>
      mean(rs.map((r) => sel(r.cost!)));
    for (const c of cells) {
      const withCost = c.runs.filter((r) => r.cost?.measured);
      if (!withCost.length) continue;
      const mc = meanCost(c.runs);
      const costStr = mc === null ? '—' : fmtUsd(mc);
      console.log(
        `${pad(c.scenario, 24)} ${pad(c.agent, 7)} ${pad(String(withCost.length), 5)} ${pad(costStr, 9)} ` +
          `${pad(fmtTok(meanTok(withCost, (x) => x.inputTokens)), 8)} ` +
          `${pad(fmtTok(meanTok(withCost, (x) => x.cachedInputTokens)), 8)} ` +
          `${pad(fmtTok(meanTok(withCost, (x) => x.outputTokens)), 8)}`,
      );
    }
    const priced = results.filter((r) => r.cost?.priced && typeof r.cost.usd === 'number');
    const total = priced.reduce((a, r) => a + (r.cost!.usd ?? 0), 0);
    console.log('─'.repeat(74));
    console.log(
      `  total: ${fmtUsd(total)} over ${priced.length} priced run(s)` +
        (priced.length ? ` (mean ${fmtUsd(total / priced.length)}/run)` : ''),
    );
    // Surface any model that produced usage but has no rate → its cost is `—`.
    const unpriced = [
      ...new Set(
        results
          .filter((r) => r.cost?.measured && !r.cost.priced)
          .map((r) => r.meta.model ?? r.meta.agent),
      ),
    ];
    if (unpriced.length) {
      console.log(`  ⚠ unpriced model(s): ${unpriced.join(', ')} — add rates to scoring/pricing.ts for a $ estimate.`);
    }
  }

  // --- 2. JUDGE NOTES (the richest signal) ---
  console.log(`\n\n=== Judge notes (per run) ===`);
  const condOf = (r: ReadinessResult): string => {
    const v = r.meta.variant;
    return v.skill && v.scaffold ? 'skill+scaffold' : v.skill ? 'skill' : v.scaffold ? 'scaffold' : 'blank';
  };
  const sortedRuns = [...results].sort(
    (a, b) =>
      a.meta.scenario.localeCompare(b.meta.scenario) ||
      a.meta.variant.agentLabel.localeCompare(b.meta.variant.agentLabel) ||
      condOf(a).localeCompare(condOf(b)),
  );
  let lastScenario = '';
  for (const r of sortedRuns) {
    if (r.meta.scenario !== lastScenario) {
      console.log(`\n${r.meta.scenario}`);
      lastScenario = r.meta.scenario;
    }
    const fn = measured(r) ? (r.functionalPassed ? '✓' : '✗') : '–';
    const tag = `${r.meta.variant.agentLabel}/${condOf(r)}`;
    console.log(`  ${pad(tag, 20)} fn ${fn}  rd ${padL(String(r.score), 3)}`);
    const summary = r.judge?.summary?.trim();
    if (summary) console.log(wrap(summary, 84, '      '));
    else if (r.judge?.error) console.log(`      (judge: ${r.judge.error})`);
  }

  // --- 3. SDK DEFECTS (release-blocker worklist) ---
  interface SdkDefect {
    id: string;
    title: string;
    maxSev: Severity;
    runs: number;
    inPassingRuns: number;
    scenarios: Set<string>;
  }
  const defects = new Map<string, SdkDefect>();
  for (const r of results) {
    for (const f of r.findings ?? []) {
      if (f.lever !== 'sdk') continue;
      let d = defects.get(f.id);
      if (!d) {
        d = { id: f.id, title: f.title, maxSev: f.severity, runs: 0, inPassingRuns: 0, scenarios: new Set() };
        defects.set(f.id, d);
      }
      d.runs += 1;
      // "rode along in a working build" — the headline can hide a release-blocker.
      if (r.meta.gatePassed) d.inPassingRuns += 1;
      d.scenarios.add(r.meta.scenario);
      if (SEV_RANK[f.severity] > SEV_RANK[d.maxSev]) d.maxSev = f.severity;
      if (!d.title && f.title) d.title = f.title;
    }
  }
  console.log(`\n\n=== SDK defects (release-blocker worklist) ===\n`);
  if (defects.size === 0) {
    console.log('  none — no sdk-lever findings across these runs');
  } else {
    const ranked = [...defects.values()].sort(
      (a, b) => SEV_RANK[b.maxSev] - SEV_RANK[a.maxSev] || b.runs - a.runs,
    );
    console.log(`${pad('sev', 7)} ${pad('id', 28)} ${pad('runs', 5)} ${pad('inBuild', 8)} scenarios`);
    console.log('─'.repeat(78));
    for (const d of ranked) {
      const sev = d.maxSev === 'high' ? '⚠ HIGH' : d.maxSev;
      const inBuild = d.inPassingRuns > 0 ? `${d.inPassingRuns}/${d.runs}` : '·';
      console.log(
        `${pad(sev, 7)} ${pad(d.id, 28)} ${pad(String(d.runs), 5)} ${pad(inBuild, 8)} ${[...d.scenarios].join(', ')}`,
      );
    }
    const hiddenHigh = ranked.filter((d) => d.maxSev === 'high' && d.inPassingRuns > 0);
    if (hiddenHigh.length > 0) {
      console.log(`\n  ⚠ ${hiddenHigh.length} HIGH-severity SDK defect(s) rode along inside builds that PASSED:`);
      for (const d of hiddenHigh) console.log(`      ${d.id} — ${d.title}`);
    }
  }
  console.log('');
}

main();
