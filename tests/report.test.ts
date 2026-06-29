import { describe, expect, it } from "vitest";
import {
  collectJudgeFindings,
  collectReadinessPenalties,
  renderReport,
} from "../src/report.js";
import type { RunResult, TrialResult } from "../src/types.js";

function trial(overrides: Partial<TrialResult>): TrialResult {
  return {
    task: "01-basic-tool-server",
    variant: "noskill+blank",
    trial: 1,
    promptHash: "abc123",
    agentRunner: "claude",
    agentModel: "default",
    sdkVersion: "1.2.3",
    readiness: {
      score: 100,
      functionalScore: 100,
      functionalSuccess: true,
      checks: [
        { id: "compiles", weight: 20, passed: true },
        { id: "starts", weight: 20, passed: true },
        { id: "tools", weight: 30, passed: true },
        { id: "calls", weight: 30, passed: true },
      ],
      penalties: [],
      judge: null,
    },
    durationMs: 60000,
    turns: 10,
    costUsd: 0.42,
    transcriptPath: "trials/x/transcript.md",
    timestamp: "2026-06-11T00:00:00Z",
    error: null,
    ...overrides,
  };
}

const FAILED = trial({
  variant: "skill+scaffold",
  readiness: {
    score: 40,
    functionalScore: 40,
    functionalSuccess: false,
    checks: [
      { id: "compiles", weight: 20, passed: true },
      { id: "starts", weight: 20, passed: true },
      {
        id: "tools",
        weight: 30,
        passed: false,
        detail: 'tool "add" not listed',
      },
      { id: "calls", weight: 30, passed: false, detail: "server not running" },
    ],
    penalties: [
      {
        detector: "hand-rolled-content-block",
        points: 8,
        file: "index.ts",
        line: 4,
        evidence: "content: [{",
        lever: "skill",
        source: "deterministic",
      },
    ],
    judge: null,
  },
});

const RUN: RunResult = {
  runId: "2026-06-11T00-00-00",
  startedAt: "2026-06-11T00:00:00.000Z",
  agentRunner: "claude",
  agentModel: "default",
  judgeModel: "gpt-5.5",
  trials: [trial({}), FAILED],
};

describe("renderReport", () => {
  const report = renderReport(RUN);

  it("includes a summary row per task×variant with readiness and penalty counts", () => {
    expect(report).toContain(
      "| 01-basic-tool-server | noskill+blank | 1/1 ✅ | 100 | 0/1 trials | $0.42 | 10 |"
    );
    expect(report).toContain(
      "| 01-basic-tool-server | skill+scaffold | 0/1 ❌ | 40 | 1/1 trials | $0.42 | 10 |"
    );
  });

  it("lists readiness penalty names per trial in the detail table", () => {
    expect(report).toContain(
      "| Variant | Trial | compiles | imports | starts | auth | tools | resources | calls |"
    );
    expect(report).toMatch(
      /\| skill\+scaffold \| 1 \|.*\| 40 \| `hand-rolled-content-block` \|/
    );
  });

  it("renders the variant matrix with readiness deltas when multiple variants ran", () => {
    expect(report).toContain("## Variant Matrix (Mean Readiness)");
    expect(report).toContain("| no skill | 100 |");
    expect(report).toContain("Skill readiness uplift: -60");
  });

  it("renders docs variants in the variant matrix", () => {
    const docsReport = renderReport({
      ...RUN,
      trials: [
        trial({}),
        trial({
          variant: "blank+docs-old",
          readiness: { ...trial({}).readiness, score: 85 },
        }),
        trial({
          variant: "blank+docs-new",
          readiness: { ...trial({}).readiness, score: 95 },
        }),
      ],
    });
    expect(docsReport).toContain("|  | blank | scaffold | docs old | docs new |");
    expect(docsReport).toContain("| no skill | 100 | - | 85 | 95 |");
    expect(docsReport).toContain("New docs uplift vs old docs: +10");
  });

  it("renders a docs comparison scorecard", () => {
    const oldPenaltyTrial = trial({
      variant: "blank+docs-old",
      readiness: {
        ...trial({}).readiness,
        score: 80,
        penalties: [
          {
            detector: "raw-sdk-import",
            points: 25,
            evidence: "imported from sdk/server",
            lever: "docs",
            source: "deterministic",
          },
        ],
      },
    });
    const docsReport = renderReport({
      ...RUN,
      trials: [
        trial({}),
        oldPenaltyTrial,
        trial({
          variant: "blank+docs-new",
          readiness: { ...trial({}).readiness, score: 90 },
        }),
      ],
    });

    expect(docsReport).toContain("## Docs Comparison");
    expect(docsReport).toContain(
      "| Task | Blank | Old docs | New docs | New vs old | New vs blank | Functional delta | Top changed penalties |"
    );
    expect(docsReport).toContain(
      "| 01-basic-tool-server | 100 | 80 | 90 | +10 | -10 | +0pp | `raw-sdk-import` -1 |"
    );
  });

  it("aggregates readiness penalties with counts, lever, and source", () => {
    expect(report).toContain("## Top Readiness Penalties");
    expect(report).toContain("`hand-rolled-content-block`");
    expect(report).toContain("8 pts");
    expect(report).toContain("lever: skill");
    expect(report).toContain("source: deterministic");
  });

  it("includes per-check failure details", () => {
    expect(report).toContain('tool "add" not listed');
  });

  it("renders judge discovery findings outside readiness penalties", () => {
    const withJudge = renderReport({
      ...RUN,
      trials: [
        trial({
          readiness: {
            score: 100,
            functionalScore: 100,
            functionalSuccess: true,
            checks: [],
            penalties: [],
            judge: {
              model: "m",
              criteria: [],
              findings: [
                {
                  detector: "judge:struggled",
                  evidence: "retried 4 times",
                  lever: "process",
                },
              ],
            },
          },
        }),
      ],
    });
    expect(withJudge).toContain("## Judge Discovery Findings");
    expect(withJudge).toContain("`judge:struggled`");
    expect(withJudge).toContain("None detected - no readiness penalties fired.");
  });
});

describe("collectReadinessPenalties", () => {
  it("counts trials, not raw hits, sorts by frequency, and keeps judge penalties scored", () => {
    const t1 = trial({
      readiness: {
        score: 75,
        functionalScore: 100,
        functionalSuccess: true,
        checks: [],
        penalties: [
          {
            detector: "raw-sdk-import",
            points: 25,
            file: "a.ts",
            line: 1,
            evidence: "x",
            lever: "docs",
            source: "deterministic",
          },
          {
            detector: "raw-sdk-import",
            points: 25,
            file: "b.ts",
            line: 1,
            evidence: "y",
            lever: "docs",
            source: "deterministic",
          },
        ],
        judge: null,
      },
    });
    const t2 = trial({
      trial: 2,
      readiness: {
        score: 67,
        functionalScore: 100,
        functionalSuccess: true,
        checks: [],
        penalties: [
          {
            detector: "raw-sdk-import",
            points: 25,
            file: "c.ts",
            line: 9,
            evidence: "z",
            lever: "docs",
            source: "deterministic",
          },
          {
            detector: "judge:unclear-tool-descriptions",
            points: 8,
            evidence: "description is vague",
            lever: "docs",
            source: "judge",
          },
        ],
        judge: {
          model: "m",
          criteria: [],
          findings: [
            {
              detector: "judge:struggled",
              evidence: "retried 4 times",
              lever: "process",
            },
          ],
        },
      },
    });
    const penalties = collectReadinessPenalties([t1, t2]);
    expect(penalties[0]).toMatchObject({
      detector: "raw-sdk-import",
      count: 2,
    });
    expect(
      penalties.find((p) => p.detector === "judge:unclear-tool-descriptions")
    ).toMatchObject({ count: 1, source: "judge" });
    expect(collectJudgeFindings([t1, t2])).toMatchObject([
      { detector: "judge:struggled", count: 1 },
    ]);
  });
});
