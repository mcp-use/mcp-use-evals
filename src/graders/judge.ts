import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import type { Finding, Lever, LoadedTask, ReadinessJudge } from "../types.js";

export const DEFAULT_JUDGE_MODEL = "gpt-5.5";

/**
 * Binary criteria, not 0-5 sliders: yes/no/unknown verdicts are far more
 * reproducible run-to-run, which is what a longitudinal metric needs.
 * "unknown" is the escape hatch and does not affect readiness.
 */
const CRITERIA: Array<{
  id: string;
  detector: string;
  lever: Lever;
  points: number;
  question: string;
}> = [
  {
    id: "imports-from-mcp-use",
    detector: "sdk-api-not-used",
    lever: "docs",
    points: 25,
    question:
      "Does the code import the server API from 'mcp-use/server' (or 'mcp-use') rather than hand-rolling protocol handling?",
  },
  {
    id: "uses-zod-schema",
    detector: "missing-zod-schema",
    lever: "docs",
    points: 10,
    question:
      "Are tool input schemas defined with zod and passed to the tool definition?",
  },
  {
    id: "uses-response-helpers",
    detector: "no-response-helper-import",
    lever: "docs",
    points: 8,
    question:
      "Do tool handlers return via mcp-use response helpers (text(), object(), …) rather than hand-built content arrays?",
  },
  {
    id: "no-hallucinated-api",
    detector: "invented-api-repair",
    lever: "sdk",
    points: 15,
    question:
      "Is the code free of invented/nonexistent mcp-use APIs (methods, options, imports that don't exist)?",
  },
  {
    id: "error-handling-reasonable",
    detector: "judge:error-handling-unreasonable",
    lever: "process",
    points: 8,
    question:
      "Is error handling reasonable for the task (invalid input doesn't crash the server; no pointless defensive boilerplate either)?",
  },
  {
    id: "tool-descriptions-clear",
    detector: "judge:unclear-tool-descriptions",
    lever: "docs",
    points: 8,
    question:
      "Do tools have clear names and descriptions an LLM client could act on?",
  },
  {
    id: "self-verified",
    detector: "no-self-verification",
    lever: "process",
    points: 12,
    question:
      "Per the transcript, did the agent verify its own work before finishing (typecheck/build, start the server, or exercise a tool)?",
  },
];

const JudgeOutput = z.object({
  criteria: z.array(
    z.object({
      id: z.string(),
      verdict: z.enum(["yes", "no", "unknown"]),
      evidence: z.string(),
    })
  ),
  findings: z.array(
    z.object({
      category: z.enum([
        "struggled",
        "hallucinated-api",
        "no-self-verification",
        "fought-template",
        "other",
      ]),
      evidence: z.string(),
      suggestion: z.string(),
    })
  ),
});

const SYSTEM = `You are grading how well a coding agent used the mcp-use TypeScript SDK to build an MCP server. You receive the task prompt, the produced source files, and a condensed transcript of the agent's session.

Answer each readiness criterion with a binary verdict:
- "yes" / "no" only when the provided code or transcript contains direct evidence — quote it in the evidence field.
- "unknown" when you cannot tell from what's provided. Never guess.

Also extract unscored discovery findings from the transcript — places the agent struggled, retried, hallucinated APIs or CLI flags, fought a scaffold template, or skipped verifying its own work. For each, give concrete evidence and a suggestion for what the mcp-use team should improve (docs, skill content, SDK API/error messages, or template). Report only findings with transcript/code evidence; an empty list is a valid answer.`;

const MAX_SOURCE_CHARS = 40_000;
const MAX_TRANSCRIPT_CHARS = 30_000;

export async function gradeWithJudge(opts: {
  task: LoadedTask;
  sources: Map<string, string>;
  transcript: string;
  model?: string;
}): Promise<ReadinessJudge> {
  const model = opts.model ?? DEFAULT_JUDGE_MODEL;
  const sourcesText = truncateMiddle(
    [...opts.sources.entries()]
      .map(([file, content]) => `### ${file}\n\`\`\`ts\n${content}\n\`\`\``)
      .join("\n\n"),
    MAX_SOURCE_CHARS
  );
  const transcriptText = truncateMiddle(
    opts.transcript || "(no transcript — golden/manual run)",
    MAX_TRANSCRIPT_CHARS
  );

  const userMessage = [
    `## Task prompt given to the agent\n${opts.task.prompt}`,
    `## Produced source files\n${sourcesText || "(no source files found)"}`,
    `## Agent transcript (condensed)\n${transcriptText}`,
    `## Readiness criteria to grade\n${CRITERIA.map((a) => `- ${a.id} (${a.points} pts if no): ${a.question}`).join("\n")}`,
  ].join("\n\n");

  if (model.startsWith("gpt")) {
    const response = await generateObject({
      model: openai.responses(model),
      system: SYSTEM,
      prompt: userMessage,
      schema: JudgeOutput,
      providerOptions: {
        openai: {
          reasoningEffort: "medium",
        },
      },
    });
    return toReadinessJudge(response.object, model);
  }

  const client = new Anthropic();
  const response = await client.messages.parse({
    model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    output_config: { format: zodOutputFormat(JudgeOutput) },
    messages: [{ role: "user", content: userMessage }],
  });

  const parsed = response.parsed_output;
  if (!parsed)
    throw new Error("judge response did not match the output schema");

  return toReadinessJudge(parsed, model);
}

function toReadinessJudge(
  parsed: z.infer<typeof JudgeOutput>,
  model: string
): ReadinessJudge {
  const byId = new Map(parsed.criteria.map((c) => [c.id, c]));
  const criteria = CRITERIA.map((criterion) => {
    const verdict = byId.get(criterion.id);
    return {
      id: criterion.id,
      verdict: verdict?.verdict ?? "unknown",
      points: criterion.points,
      detector: criterion.detector,
      lever: criterion.lever,
      evidence: verdict?.evidence ?? "judge did not return this criterion",
    };
  });

  const findings: Finding[] = parsed.findings.map((f) => ({
    detector: `judge:${f.category}`,
    evidence: f.evidence,
    lever:
      f.category === "hallucinated-api"
        ? "sdk"
        : f.category === "fought-template"
          ? "template"
          : "process",
  }));

  return { criteria, findings, model };
}

function truncateMiddle(s: string, max: number): string {
  if (s.length <= max) return s;
  const half = Math.floor(max / 2);
  return `${s.slice(0, half)}\n\n…[truncated ${s.length - max} chars]…\n\n${s.slice(-half)}`;
}
