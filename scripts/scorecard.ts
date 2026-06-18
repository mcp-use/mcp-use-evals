/**
 * Scorecard aggregator. Scans results/, pulls each run's
 * result.analysis.readiness, and prints:
 *   1. per-variant rows  (scenario · variant · n · mean score · reliability · top levers)
 *   2. deltas            (skill Δ and scaffold Δ, holding the other factors constant)
 *   3. global lever rollup (the improvement-loop worklist)
 *
 * Reproducible: re-run any time over existing results — it never re-runs agents.
 * Run with `npm run scorecard` (Node 24 strips the TS types).
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ReadinessResult, Lever, Finding, Severity } from '../scoring/types.js';

const LEVERS = ['docs', 'template', 'sdk', 'skill', 'process'] as const;
const RESULTS_DIR = join(process.cwd(), 'results');
const SEV_RANK: Record<Severity, number> = { low: 1, medium: 2, high: 3 };

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry === 'result.json') out.push(full);
  }
  return out;
}

function loadReadiness(): ReadinessResult[] {
  const results: ReadinessResult[] = [];
  for (const file of walk(RESULTS_DIR)) {
    try {
      const parsed = JSON.parse(readFileSync(file, 'utf-8')) as { analysis?: { readiness?: ReadinessResult } };
      const r = parsed.analysis?.readiness;
      if (r && typeof r.score === 'number' && r.meta) results.push(r);
    } catch {
      /* skip unreadable/legacy result.json */
    }
  }
  return results;
}

interface Group {
  scenario: string;
  variantLabel: string;
  agentLabel: string;
  skill: boolean;
  scaffold: boolean;
  scores: number[];
  gates: boolean[];
  levers: Record<Lever, number>;
  findings: Finding[];
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function group(results: ReadinessResult[]): Map<string, Group> {
  const map = new Map<string, Group>();
  for (const r of results) {
    const v = r.meta.variant;
    const key = `${r.meta.scenario}::${r.meta.variantLabel}`;
    let g = map.get(key);
    if (!g) {
      g = {
        scenario: r.meta.scenario,
        variantLabel: r.meta.variantLabel,
        agentLabel: v.agentLabel,
        skill: v.skill,
        scaffold: v.scaffold,
        scores: [],
        gates: [],
        levers: { docs: 0, template: 0, sdk: 0, skill: 0, process: 0 },
        findings: [],
      };
      map.set(key, g);
    }
    g.scores.push(r.score);
    g.gates.push(r.meta.gatePassed);
    for (const lev of LEVERS) g.levers[lev] += r.levers?.[lev] ?? 0;
    if (Array.isArray(r.findings)) g.findings.push(...r.findings);
  }
  return map;
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function topLevers(levers: Record<Lever, number>): string {
  const entries = LEVERS.map((l) => [l, levers[l]] as const).filter(([, c]) => c > 0);
  entries.sort((a, b) => b[1] - a[1]);
  return entries.length ? entries.map(([l, c]) => `${l}:${c}`).join(' ') : '—';
}

function main(): void {
  const results = loadReadiness();
  if (results.length === 0) {
    console.log(`No readiness results found under ${RESULTS_DIR}.`);
    console.log('Run an experiment first, e.g. `npx agent-eval blank-cc`.');
    return;
  }

  const groups = [...group(results).values()].sort(
    (a, b) => a.scenario.localeCompare(b.scenario) || a.variantLabel.localeCompare(b.variantLabel),
  );

  console.log(`\n=== Readiness scorecard (${results.length} runs) ===\n`);
  console.log(
    `${pad('scenario', 16)} ${pad('variant', 20)} ${pad('n', 3)} ${pad('mean', 6)} ${pad('reliab', 7)} ${pad('sdk!', 5)} levers`,
  );
  console.log('-'.repeat(84));
  for (const g of groups) {
    const reliab = `${Math.round((g.gates.filter(Boolean).length / g.gates.length) * 100)}%`;
    // High-severity SDK defects: the SDK fought a correct user. `sdk!` makes them
    // visible right next to the score, so a passing row can't hide a release-blocker.
    const sdkHigh = g.findings.filter((f) => f.lever === 'sdk' && f.severity === 'high').length;
    const sdkCol = sdkHigh > 0 ? `⚠${sdkHigh}` : '·';
    console.log(
      `${pad(g.scenario, 16)} ${pad(g.variantLabel, 20)} ${pad(String(g.scores.length), 3)} ${pad(
        mean(g.scores).toFixed(1),
        6,
      )} ${pad(reliab, 7)} ${pad(sdkCol, 5)} ${topLevers(g.levers)}`,
    );
  }

  // --- deltas ---
  const byKey = group(results);
  const meanFor = (scenario: string, agentLabel: string, skill: boolean, scaffold: boolean): number | null => {
    const cond = skill && scaffold ? 'skill+scaffold' : skill ? 'skill' : scaffold ? 'scaffold' : 'blank';
    const g = byKey.get(`${scenario}::${cond}-${agentLabel}`);
    return g ? mean(g.scores) : null;
  };

  const scenarios = [...new Set(groups.map((g) => g.scenario))];
  const agents = [...new Set(groups.map((g) => g.agentLabel))];

  console.log(`\n=== Deltas (Δ score) ===\n`);
  console.log(`${pad('scenario', 16)} ${pad('agent', 8)} ${pad('comparison', 24)} Δ`);
  console.log('-'.repeat(60));
  for (const scenario of scenarios) {
    for (const agent of agents) {
      const m = (skill: boolean, scaffold: boolean) => meanFor(scenario, agent, skill, scaffold);
      // Each Δ isolates one factor, holding the other constant.
      const rows: Array<[string, number | null, number | null]> = [
        ['skill Δ (scaffold=off)', m(true, false), m(false, false)],
        ['skill Δ (scaffold=on)', m(true, true), m(false, true)],
        ['scaffold Δ (skill=off)', m(false, true), m(false, false)],
        ['scaffold Δ (skill=on)', m(true, true), m(true, false)],
      ];
      for (const [label, a, b] of rows) {
        if (a === null || b === null) continue;
        const diff = a - b;
        const ds = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}`;
        console.log(`${pad(scenario, 16)} ${pad(agent, 8)} ${pad(label, 24)} ${ds}`);
      }
    }
  }

  // --- SDK defects (the visible worklist) ---
  // Every `sdk`-lever finding is the SDK fighting a CORRECT user — a product bug
  // fixable once for every user, not a docs/skill gap. The score is deterministic-
  // anchored, so a high-severity SDK defect can ride along inside a passing run
  // (e.g. the agent worked around a broken `listen()`). This section drags those
  // into the open: distinct defect ids, severity, how often, and — loudest — how
  // many of the runs that hit it still PASSED the gate.
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
      if (r.meta.gatePassed) d.inPassingRuns += 1;
      d.scenarios.add(r.meta.scenario);
      if (SEV_RANK[f.severity] > SEV_RANK[d.maxSev]) d.maxSev = f.severity;
      if (!d.title && f.title) d.title = f.title;
    }
  }
  console.log(`\n=== SDK defects (the visible worklist) ===\n`);
  if (defects.size === 0) {
    console.log('  none — no sdk-lever findings across these runs\n');
  } else {
    const ranked = [...defects.values()].sort(
      (a, b) => SEV_RANK[b.maxSev] - SEV_RANK[a.maxSev] || b.runs - a.runs,
    );
    console.log(`${pad('sev', 7)} ${pad('id', 40)} ${pad('runs', 5)} ${pad('inPass', 7)} scenarios`);
    console.log('-'.repeat(94));
    for (const d of ranked) {
      const sev = d.maxSev === 'high' ? '⚠ HIGH' : d.maxSev;
      const inPass = d.inPassingRuns > 0 ? `${d.inPassingRuns}/${d.runs}` : '·';
      console.log(
        `${pad(sev, 7)} ${pad(d.id, 40)} ${pad(String(d.runs), 5)} ${pad(inPass, 7)} ${[...d.scenarios].join(', ')}`,
      );
    }
    const hiddenHigh = ranked.filter((d) => d.maxSev === 'high' && d.inPassingRuns > 0);
    if (hiddenHigh.length > 0) {
      console.log(
        `\n  ⚠ ${hiddenHigh.length} HIGH-severity SDK defect(s) rode along inside PASSING runs — release-blockers the headline score hides:`,
      );
      for (const d of hiddenHigh) console.log(`      ${d.id} — ${d.title}`);
    }
    console.log('');
  }

  // --- global lever rollup ---
  const total: Record<Lever, number> = { docs: 0, template: 0, sdk: 0, skill: 0, process: 0 };
  for (const g of groups) for (const l of LEVERS) total[l] += g.levers[l];
  console.log(`\n=== Lever rollup (improvement worklist) ===\n`);
  for (const l of LEVERS) console.log(`  ${pad(l, 9)} ${total[l]}`);
  console.log('');
}

main();
