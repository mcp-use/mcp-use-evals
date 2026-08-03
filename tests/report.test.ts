import { readFileSync } from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { consoleSummary, renderReport } from "../src/report.js";
import type { RunResult, TrialGrade, TrialPerf, TrialResult } from "../src/types.js";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, readFileSync: vi.fn(actual.readFileSync) };
});

const readFileSyncMock = vi.mocked(readFileSync);

function grade(overrides: Partial<TrialGrade> = {}): TrialGrade {
  return {
    contractPass: true,
    checks: [
      { id: "install", pass: true, required: true, detail: null },
      { id: "start", pass: true, required: true, detail: null },
      { id: "tools", pass: true, required: true, detail: null },
      { id: "calls", pass: true, required: true, detail: null },
    ],
    failureCode: null,
    sdkPath: "mcp-use",
    scoredForPassRate: true,
    ...overrides,
  };
}

function perf(overrides: Partial<TrialPerf> = {}): TrialPerf {
  return {
    durationMs: 60_000,
    turns: 10,
    tokensIn: 1000,
    tokensOut: 500,
    toolCalls: 4,
    costUsd: 0.42,
    ...overrides,
  };
}

function trial(overrides: Partial<TrialResult> = {}): TrialResult {
  return {
    task: "01-basic-tool-server",
    variant: "noskill+blank",
    trial: 1,
    promptHash: "abc123",
    agentRunner: "claude",
    agentModel: "default",
    sdkVersion: "1.2.3",
    valid: true,
    grade: grade(),
    perf: perf(),
    memoPath: null,
    transcriptPath: "trials/x/transcript.md",
    timestamp: "2026-06-11T00:00:00Z",
    error: null,
    ...overrides,
  };
}

function run(trials: TrialResult[]): RunResult {
  return {
    runId: "01-basic-tool-server--noskill+blank--2026-06-11T00-00-00",
    batchId: "local-2026-06-11",
    startedAt: "2026-06-11T00:00:00.000Z",
    agentRunner: "claude",
    agentModel: "default",
    judgeModel: "gpt-5.5",
    manifest: {
      graderVersion: "2.0.0",
      sandbox: "docker",
      taskPromptHashes: { "01-basic-tool-server": "abc123" },
      skillHash: null,
    },
    trials,
  };
}

beforeEach(() => {
  readFileSyncMock.mockReset();
  readFileSyncMock.mockImplementation(() => {
    throw new Error("ENOENT");
  });
});

describe("renderReport — pass rate headline", () => {
  it("identifies the logical evaluation batch that contains this sharded run", () => {
    const report = renderReport(run([trial()]));
    expect(report).toContain("batch `local-2026-06-11`");
  });

  it("prints the pass-rate fraction, excluding invalid and static trials from the denominator", () => {
    const r = run([
      trial({ trial: 1, grade: grade({ contractPass: true }) }),
      trial({ trial: 2, grade: grade({ contractPass: false, failureCode: "contract.tools" }) }),
      trial({
        trial: 3,
        valid: false,
        grade: { contractPass: false, checks: [], failureCode: "infra.sandbox", sdkPath: "unknown", scoredForPassRate: true },
      }),
      trial({
        trial: 4,
        variant: "noskill+blank",
        task: "05-app-deploy",
        grade: grade({ scoredForPassRate: false }),
      }),
    ]);
    const report = renderReport(r);
    // 2 valid+scored trials (1 pass, 1 fail); trial 3 is invalid, trial 4 is static.
    expect(report).toContain("Pass rate: 50% (1/2 valid scored trials)");
  });
});

describe("renderReport — matrix", () => {
  it("separates static (scoredForPassRate: false) tasks into their own table", () => {
    const r = run([
      trial({ trial: 1 }),
      trial({ trial: 2, task: "05-app-deploy", grade: grade({ scoredForPassRate: false }) }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## Matrix");
    expect(report).toContain("| 01-basic-tool-server | noskill+blank | 1/1 |");
    expect(report).toContain("### Static adoption tasks (not in pass rate)");
    expect(report).toContain("| 05-app-deploy | noskill+blank | 1/1 |");
  });
});

describe("renderReport — pass^k", () => {
  it("is omitted when any scored cell has fewer than 2 trials", () => {
    const r = run([trial({ trial: 1 })]);
    expect(renderReport(r)).not.toContain("## pass^k");
  });

  it("computes the all-k-trials-pass fraction across task×condition cells", () => {
    const r = run([
      trial({ trial: 1, variant: "noskill+blank" }),
      trial({ trial: 2, variant: "noskill+blank" }),
      trial({ trial: 1, variant: "skill+blank", grade: grade({ contractPass: false, failureCode: "contract.calls" }) }),
      trial({ trial: 2, variant: "skill+blank" }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## pass^k");
    // noskill+blank cell all-pass; skill+blank cell has one failure -> 1/2 cells all-pass.
    expect(report).toContain("pass^2: 50% (1/2 task×condition cells all-pass, min 2 trials/cell)");
  });
});

describe("renderReport — deltas", () => {
  it("omits the Deltas section when no paired variants ran", () => {
    const r = run([trial({ trial: 1 })]);
    expect(renderReport(r)).not.toContain("## Deltas");
  });

  it("prints a paired skill vs noskill delta with trial counts", () => {
    const r = run([
      trial({ trial: 1, variant: "noskill+blank", grade: grade({ contractPass: true }) }),
      trial({ trial: 2, variant: "noskill+blank", grade: grade({ contractPass: false, failureCode: "contract.tools" }) }),
      trial({ trial: 1, variant: "skill+blank", grade: grade({ contractPass: true }) }),
      trial({ trial: 2, variant: "skill+blank", grade: grade({ contractPass: true }) }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## Deltas");
    expect(report).toContain("**skill+blank vs noskill+blank**: +50pp (2/2 vs 1/2)");
  });

});

describe("renderReport — performance", () => {
  it("computes medians over passing trials only, and cost across all trials", () => {
    const r = run([
      trial({ trial: 1, perf: perf({ durationMs: 60_000, turns: 10, toolCalls: 4, costUsd: 0.4 }) }),
      trial({ trial: 2, perf: perf({ durationMs: 120_000, turns: 20, toolCalls: 8, costUsd: 0.6 }) }),
      trial({
        trial: 3,
        grade: grade({ contractPass: false, failureCode: "contract.calls" }),
        perf: perf({ durationMs: 999_000, turns: 999, toolCalls: 999, costUsd: 5 }),
      }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## Performance (passing trials)");
    expect(report).toContain("Median duration: 1m30s"); // median of 60s/120s over the 2 passing trials
    expect(report).toContain("Median turns: 15");
    expect(report).toContain("Median tool calls: 6");
    // total cost sums ALL trials (0.4 + 0.6 + 5 = 6), cost per success divides by passes (2)
    expect(report).toContain("Total cost: $6.00");
    expect(report).toContain("Cost per success: $3.00");
  });

  it("reports no passing trials plainly", () => {
    const r = run([trial({ grade: grade({ contractPass: false, failureCode: "contract.start" }) })]);
    expect(renderReport(r)).toContain("No passing trials.");
  });
});

describe("renderReport — failure breakdown and sdk path", () => {
  it("counts contract.* failures and infra.* invalid trials separately", () => {
    const r = run([
      trial({ trial: 1, grade: grade({ contractPass: false, failureCode: "contract.tools" }) }),
      trial({ trial: 2, grade: grade({ contractPass: false, failureCode: "contract.tools" }) }),
      trial({
        trial: 3,
        valid: false,
        grade: { contractPass: false, checks: [], failureCode: "infra.agent", sdkPath: "unknown", scoredForPassRate: true },
      }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## Failure breakdown");
    expect(report).toContain("`contract.tools`: 2");
    expect(report).toContain("Invalid trials: 1");
    expect(report).toContain("`infra.agent`: 1");
  });

  it("counts trials by sdkPath as a plain fact", () => {
    const r = run([
      trial({ trial: 1, grade: grade({ sdkPath: "mcp-use" }) }),
      trial({ trial: 2, grade: grade({ sdkPath: "hand-rolled" }) }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## SDK path");
    expect(report).toContain("`mcp-use`: 1");
    expect(report).toContain("`hand-rolled`: 1");
  });
});

describe("renderReport — memos", () => {
  it("always lists failed trials with a memo, quoting the memo's first line", () => {
    readFileSyncMock.mockImplementation(() => "Struggled to find the right import.\nmore detail here");
    const r = run([
      trial({
        trial: 1,
        grade: grade({ contractPass: false, failureCode: "contract.tools" }),
        memoPath: "trials/foo--noskill+blank--t1/memo.md",
      }),
    ]);
    const report = renderReport(r);
    expect(report).toContain("## Memos");
    expect(report).toContain("trials/foo--noskill+blank--t1/memo.md");
    expect(report).toContain("Struggled to find the right import.");
  });

  it("excludes passing trials whose memo is exactly 'Nothing notable.'", () => {
    readFileSyncMock.mockImplementation(() => "Nothing notable.");
    const r = run([trial({ trial: 1, memoPath: "trials/x/memo.md" })]);
    expect(renderReport(r)).toContain("No notable memos.");
  });

  it("includes passing trials whose memo found something worth reading", () => {
    readFileSyncMock.mockImplementation(() => "Papercut: error message did not mention the missing env var.");
    const r = run([trial({ trial: 1, memoPath: "trials/x/memo.md" })]);
    const report = renderReport(r);
    expect(report).toContain("Papercut: error message did not mention the missing env var.");
  });
});

describe("consoleSummary", () => {
  it("prints the pass rate and per task×condition breakdown", () => {
    const r = run([
      trial({ trial: 1 }),
      trial({ trial: 2, grade: grade({ contractPass: false, failureCode: "contract.tools" }) }),
    ]);
    const summary = consoleSummary(r);
    expect(summary).toContain("Pass rate: 50% (1/2 valid scored trials)");
    expect(summary).toContain("01-basic-tool-server · noskill+blank: 1/2");
  });
});
