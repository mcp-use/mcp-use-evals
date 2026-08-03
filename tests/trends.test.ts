import { describe, expect, it, vi } from "vitest";
import { collectRuns, renderTrendsTable, type RawRunFile } from "../src/trends.js";
import { TrendRunSchema } from "../src/types.js";

function v2Run(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    runId: "01-basic-tool-server--noskill+blank--2026-06-12T00-00-00",
    startedAt: "2026-06-12T00:00:00.000Z",
    agentRunner: "claude",
    agentModel: "default",
    judgeModel: "gpt-5.5",
    manifest: {
      graderVersion: "2.0.0",
      sandbox: "docker",
      taskPromptHashes: {},
      skillHash: null,
    },
    trials: [
      {
        task: "01-basic-tool-server",
        variant: "noskill+blank",
        trial: 1,
        promptHash: "abc123",
        agentRunner: "claude",
        agentModel: "default",
        sdkVersion: "1.2.3",
        valid: true,
        grade: {
          contractPass: true,
          checks: [],
          failureCode: null,
          sdkPath: "mcp-use",
          scoredForPassRate: true,
        },
        perf: {
          durationMs: 1,
          turns: 1,
          tokensIn: null,
          tokensOut: null,
          toolCalls: 0,
          costUsd: 0.1,
        },
        memoPath: null,
        transcriptPath: null,
        timestamp: "2026-06-12T00:00:00Z",
        error: null,
      },
    ],
    ...overrides,
  };
}

describe("TrendRunSchema", () => {
  it("accepts a v2-shaped run.json", () => {
    expect(TrendRunSchema.safeParse(v2Run()).success).toBe(true);
  });

  it("tolerates extra/missing fields (forward/backward compatibility within v2)", () => {
    const run = v2Run();
    const trial = (run.trials as Record<string, unknown>[])[0]!;
    delete trial.error;
    trial.someFutureField = { anything: true };
    expect(TrendRunSchema.safeParse(run).success).toBe(true);
  });

  it("rejects a pre-v2 run.json (readiness instead of grade)", () => {
    const run = v2Run();
    const trial = (run.trials as Record<string, unknown>[])[0]!;
    delete trial.grade;
    trial.readiness = { score: 90, functionalScore: 100, functionalSuccess: true };
    expect(TrendRunSchema.safeParse(run).success).toBe(false);
  });

  it("rejects non-run-result input", () => {
    expect(TrendRunSchema.safeParse({ hello: "world" }).success).toBe(false);
    expect(TrendRunSchema.safeParse(undefined).success).toBe(false);
    expect(TrendRunSchema.safeParse([1, 2, 3]).success).toBe(false);
  });
});

describe("collectRuns", () => {
  it("keeps valid v2 runs and skips missing run.json without a warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const files: RawRunFile[] = [
      { dir: "run-a", raw: JSON.stringify(v2Run()) },
      { dir: "run-b", raw: null },
    ];
    const runs = collectRuns(files);
    expect(runs).toHaveLength(1);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("skips malformed JSON and old-schema run.json with a one-line warning each", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const oldSchema = v2Run();
    const trial = (oldSchema.trials as Record<string, unknown>[])[0]!;
    delete trial.grade;
    trial.readiness = { score: 50 };

    const files: RawRunFile[] = [
      { dir: "run-bad-json", raw: "{not json" },
      { dir: "run-old-schema", raw: JSON.stringify(oldSchema) },
      { dir: "run-good", raw: JSON.stringify(v2Run()) },
    ];
    const runs = collectRuns(files);
    expect(runs).toHaveLength(1);
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });

  it("sorts runs chronologically by startedAt", () => {
    const files: RawRunFile[] = [
      { dir: "later", raw: JSON.stringify(v2Run({ startedAt: "2026-06-13T00:00:00.000Z" })) },
      { dir: "earlier", raw: JSON.stringify(v2Run({ startedAt: "2026-06-11T00:00:00.000Z" })) },
    ];
    const runs = collectRuns(files);
    expect(runs.map((r) => r.startedAt)).toEqual([
      "2026-06-11T00:00:00.000Z",
      "2026-06-13T00:00:00.000Z",
    ]);
  });
});

describe("renderTrendsTable", () => {
  it("reports 'no runs' plainly when there is nothing to show", () => {
    expect(renderTrendsTable([])).toBe("No completed runs found.");
  });

  it("excludes invalid and non-scored trials from the pass-rate fraction, and counts invalid trials", () => {
    const run = v2Run();
    run.trials = [
      { ...(run.trials as Record<string, unknown>[])[0]!, trial: 1, valid: true, grade: { ...(run.trials as any)[0].grade, contractPass: true } },
      { ...(run.trials as Record<string, unknown>[])[0]!, trial: 2, valid: false, grade: { ...(run.trials as any)[0].grade, contractPass: true } },
      {
        ...(run.trials as Record<string, unknown>[])[0]!,
        trial: 3,
        valid: true,
        grade: { ...(run.trials as any)[0].grade, contractPass: false, scoredForPassRate: false },
      },
    ];
    const runs = collectRuns([{ dir: "r", raw: JSON.stringify(run) }]);
    const table = renderTrendsTable(runs);
    expect(table).toContain("| 2026-06-12 | claude | 1/1 | 1 |");
  });

  it("adds one column per variant seen across the window, with '-' when a run has none", () => {
    const runA = v2Run({ startedAt: "2026-06-10T00:00:00.000Z" });
    const runB = v2Run({ startedAt: "2026-06-11T00:00:00.000Z" });
    (runB.trials as Record<string, unknown>[])[0]!.variant = "skill+blank";
    const runs = collectRuns([
      { dir: "a", raw: JSON.stringify(runA) },
      { dir: "b", raw: JSON.stringify(runB) },
    ]);
    const table = renderTrendsTable(runs);
    expect(table).toContain("| Run date | Agent | Pass rate | Invalid | noskill+blank | skill+blank |");
    expect(table).toContain("| 2026-06-10 | claude | 1/1 | 0 | 1/1 | - |");
    expect(table).toContain("| 2026-06-11 | claude | 1/1 | 0 | - | 1/1 |");
  });
});
