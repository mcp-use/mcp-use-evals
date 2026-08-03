import Anthropic from "@anthropic-ai/sdk";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { collectSourceFiles } from "./functional.js";
import { renderJudgeTranscript } from "./transcript.js";
import type { LoadedTask, TrialGrade, TrialPerf } from "../types.js";

/** Pinned across runs — run.ts's default matches this. */
export const DEFAULT_JUDGE_MODEL = "gpt-5.6-sol";

export interface MemoInput {
  task: LoadedTask;
  variantId: string;
  grade: TrialGrade;
  perf: TrialPerf;
  workspaceDir: string;
  /** null → judge sees code + grade only (e.g. golden/verify-tasks runs) */
  rawJsonl: string | null;
  model: string;
}

const MAX_SOURCE_CHARS = 40_000;

/**
 * The judge is unscored: it never re-adjudicates pass/fail and affects no
 * number in any report. It reads the (already-decided) deterministic grade,
 * the produced source, and a high-fidelity transcript, then writes a short
 * prose memo diagnosing where the agent lost time or hit friction. Every
 * claim must carry a verbatim quote — that's what makes the memo useful
 * later for the weekly synthesis pass, which clusters recurring struggles
 * across many trials.
 */
const SYSTEM = `You are an SDK-usability analyst reviewing a single coding-agent trial that built an MCP server with the mcp-use TypeScript SDK.

A deterministic grader has already decided pass/fail for this trial — you are not grading it and must not re-adjudicate contractPass. Your job is diagnosis: where did the agent lose time or take a wrong turn, what did it try before something worked, and what papercuts appeared even on a run that passed (discovery friction, confusing errors, doc gaps, API surprises, fighting a scaffold/template).

Write short prose, at most ~400 words. No headings required, no JSON, no taxonomy, no categories, no scores — just a memo a human would read.

HARD RULE: every claim you make must include a short verbatim quote from the transcript (in backticks or a blockquote) or a file path + line/snippet from the produced source. Never paraphrase evidence as if it were a quote, and never state something happened without quoting where you saw it. If you cannot find supporting text, do not make the claim.

If the run was clean and you find nothing worth flagging, respond with exactly: "Nothing notable." Do not invent findings to fill space — a clean run producing "Nothing notable." is the correct, expected output for many trials.

When visible in the transcript, mention which resources the agent leaned on: the mcp-use skill file, a docs URL it fetched, grepping node_modules for API shape, etc. — this helps later synthesis see which resources actually got used.

This memo will be read alongside many others by a weekly synthesis pass that clusters recurring struggles across trials and counts how often each appears. Write concretely and specifically enough that a reader could tell whether another trial's memo describes the same issue.`;

export async function writeMemo(input: MemoInput): Promise<string> {
  const { task, variantId, grade, perf, workspaceDir, rawJsonl, model } =
    input;

  const sources = await collectSourceFiles(workspaceDir);
  const sourcesText = truncateMiddle(
    [...sources.entries()]
      .map(([file, content]) => `### ${file}\n\`\`\`ts\n${content}\n\`\`\``)
      .join("\n\n"),
    MAX_SOURCE_CHARS
  );
  const transcriptText = rawJsonl
    ? renderJudgeTranscript(rawJsonl)
    : "(no transcript available for this trial — diagnose from code and grade only)";

  const userMessage = [
    `## Task prompt given to the agent\n${task.prompt}`,
    `## Variant\n${variantId}`,
    `## Deterministic grade (already decided — diagnose, do not re-adjudicate)\n${renderGradeSummary(grade)}`,
    `## Performance (reported beside correctness, never part of the grade)\n${renderPerfSummary(perf)}`,
    `## Produced source files\n${sourcesText || "(no source files found)"}`,
    `## Agent transcript\n${transcriptText}`,
  ].join("\n\n");

  const memo = model.startsWith("gpt")
    ? await writeMemoWithOpenAi(model, userMessage)
    : await writeMemoWithAnthropic(model, userMessage);

  return memo.trim() || "Nothing notable.";
}

async function writeMemoWithOpenAi(
  model: string,
  userMessage: string
): Promise<string> {
  const response = await generateText({
    model: openai.responses(model),
    system: SYSTEM,
    prompt: userMessage,
    // gpt-5.x reasoning models don't accept a custom temperature — reasoning
    // effort is the equivalent knob for reproducibility here. The judge is
    // pinned to "low" — the installed @ai-sdk/openai's reasoningEffort union
    // ("none" | "minimal" | "low" | "medium" | "high" | "xhigh" | "max") has
    // no "light" tier, so "low" is the closest supported low-effort value.
    providerOptions: {
      openai: {
        reasoningEffort: "low",
      },
    },
  });
  return response.text;
}

async function writeMemoWithAnthropic(
  model: string,
  userMessage: string
): Promise<string> {
  const client = new Anthropic();
  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    temperature: 0,
    system: SYSTEM,
    messages: [{ role: "user", content: userMessage }],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

function renderGradeSummary(grade: TrialGrade): string {
  const checkLines =
    grade.checks
      .map(
        (c) =>
          `- ${c.id}: ${c.pass ? "pass" : "FAIL"}${c.detail ? ` — ${c.detail}` : ""}`
      )
      .join("\n") || "(no checks recorded)";
  return [
    `contractPass: ${grade.contractPass}`,
    `failureCode: ${grade.failureCode ?? "none"}`,
    `sdkPath: ${grade.sdkPath}`,
    `scoredForPassRate: ${grade.scoredForPassRate}`,
    `checks:\n${checkLines}`,
  ].join("\n");
}

function renderPerfSummary(perf: TrialPerf): string {
  return [
    `durationMs: ${perf.durationMs ?? "null"}`,
    `turns: ${perf.turns ?? "null"}`,
    `tokensIn: ${perf.tokensIn ?? "null"}`,
    `tokensOut: ${perf.tokensOut ?? "null"}`,
    `toolCalls: ${perf.toolCalls ?? "null"}`,
    `costUsd: ${perf.costUsd ?? "null"}`,
  ].join("\n");
}

function truncateMiddle(s: string, max: number): string {
  if (s.length <= max) return s;
  const half = Math.floor(max / 2);
  return `${s.slice(0, half)}\n\n…[truncated ${s.length - max} chars]…\n\n${s.slice(-half)}`;
}
