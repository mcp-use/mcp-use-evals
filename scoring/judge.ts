/**
 * The readiness judge — an LLM that reads the transcript + final code and emits
 * lever-tagged findings plus a single bounded number (processQuality, 0..1).
 *
 * Routed through the Vercel AI Gateway (same key the built-in classifier uses).
 * Degrades gracefully: if disabled or it errors, the process dimension is simply
 * marked "not measured" — it never throws into onRunComplete.
 */
import { createGateway, generateObject } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import type { Transcript } from '@vercel/agent-eval';
import type { Finding } from './types.js';
import type { SourceFile } from './source.js';
import { JUDGE_FINDING_CATALOG } from './criteria.js';

export const DEFAULT_JUDGE_MODEL = 'anthropic/claude-opus-4-8';

export function isJudgeEnabled(): boolean {
  return Boolean(
    process.env.ANTHROPIC_API_KEY || process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN,
  );
}

/**
 * Prefer the Vercel AI Gateway when its key is present (the production path, shared
 * with agent-eval's failure classifier); otherwise fall back to the Anthropic provider
 * with the bare ANTHROPIC_API_KEY. Adding a gateway key later transparently "upgrades".
 */
function useAnthropicDirect(): boolean {
  return (
    Boolean(process.env.ANTHROPIC_API_KEY) &&
    !process.env.AI_GATEWAY_API_KEY &&
    !process.env.VERCEL_OIDC_TOKEN
  );
}

export function judgeModel(): string {
  return process.env.READINESS_JUDGE_MODEL || DEFAULT_JUDGE_MODEL;
}

const LEVER_ENUM = ['docs', 'template', 'sdk', 'skill', 'process'] as const;

const JudgeSchema = z.object({
  processQuality: z
    .number()
    .min(0)
    .max(1)
    .describe(
      '0..1: did the agent verify its own work (build/run/client-test), avoid thrashing, and work cleanly? 1 = exemplary, 0 = no verification / heavy thrashing.',
    ),
  summary: z
    .string()
    .describe('2-4 sentences: where the agent struggled and concretely how it could have done better.'),
  findings: z
    .array(
      z.object({
        id: z.string().describe('short kebab-case slug, e.g. struggled-to-find-api'),
        title: z.string(),
        detail: z.string().describe('specific evidence: a transcript moment, a command, a file:loc'),
        lever: z.enum(LEVER_ENUM).describe('which lever fixes this'),
        severity: z.enum(['low', 'medium', 'high']),
      }),
    )
    .max(12)
    .describe('Distinct issues. Do NOT restate the deterministic findings already provided.'),
  suggestedLints: z
    .array(z.object({ description: z.string(), lever: z.enum(LEVER_ENUM) }))
    .max(5)
    .optional()
    .describe('Recurring patterns that could graduate into deterministic checks.'),
});

export type JudgeOutput = z.infer<typeof JudgeSchema>;

export interface JudgeInput {
  scenario: string;
  prompt: string;
  agent: string;
  transcript?: Transcript;
  serverFiles: SourceFile[];
  deterministicFindings: Finding[];
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function renderTranscript(t: Transcript | undefined): string {
  if (!t) return '(no transcript available)';
  const lines: string[] = [];
  for (const e of t.events) {
    if (e.type === 'tool_call' && e.tool) {
      const args = e.tool.args ? truncate(JSON.stringify(e.tool.args), 220) : '';
      lines.push(`TOOL ${e.tool.originalName} ${args}`);
    } else if (e.type === 'tool_result' && e.tool) {
      const r = typeof e.tool.result === 'string' ? e.tool.result : JSON.stringify(e.tool.result ?? '');
      lines.push(`  -> ${e.tool.success === false ? 'ERROR ' : ''}${truncate(r, 220)}`);
    } else if (e.type === 'message' && e.role === 'assistant' && e.content) {
      lines.push(`ASSISTANT ${truncate(e.content, 400)}`);
    } else if (e.type === 'error' && e.content) {
      lines.push(`ERROR ${truncate(e.content, 300)}`);
    }
  }
  const MAX = 200;
  if (lines.length > MAX) {
    const head = lines.slice(0, 120);
    const tail = lines.slice(-80);
    return [...head, `… (${lines.length - MAX} events elided) …`, ...tail].join('\n');
  }
  return lines.join('\n');
}

function renderCode(files: SourceFile[]): string {
  if (files.length === 0) return '(no code produced)';
  return files
    .slice(0, 12)
    .map((f) => `--- ${f.path} ---\n${truncate(f.content, 4000)}`)
    .join('\n\n');
}

const SYSTEM = `You are a senior DX engineer judging how well a coding agent used the **mcp-use TypeScript SDK** to build an MCP server.
You are given the task, the agent's full transcript, and its final code. Deterministic checks have already caught mechanical issues — your job is the qualitative read: where did the agent STRUGGLE, and how could it have done BETTER?

Score exactly one thing: processQuality (0..1) — did it verify its own work (build/run/client-test), avoid thrashing, and work cleanly? This is the ONLY number you control; the rest of the readiness score is deterministic.

Emit distinct, evidence-backed findings, each tagged with the lever that would fix it:
- docs     — the agent did the right thing but couldn't easily LEARN the API: poor discoverability/examples/usage. Fixed by better docs. NOT for cases where the SDK itself misbehaved.
- template — friction with the scaffold/starter files specifically (fighting generated files, stale boilerplate). NOT the SDK's own runtime/packaging.
- sdk      — the SDK itself fought a CORRECT user — a human would hit the same wall. Covers not just API surface (exports, types, signatures, error messages) but also: packaging/install (peer-dependency ranges, ERESOLVE, missing/incorrect deps), runtime & startup behavior (listen()/bind defaults, IPv6 vs 127.0.0.1, unexpected side-effects that block boot), and module resolution (ESM/CJS, .js↔.ts specifiers, won't run under node strip-types without tsx). When in doubt between docs and sdk: if the agent was doing the right thing and the SDK still broke or blocked it, it's sdk.
- skill    — an mcp-use skill/cheatsheet would have prevented it
- process  — agent behavior (no verification, thrashing)

Severity for sdk findings: tag HIGH when the SDK defect BLOCKED a correct user (install/build/startup failed, server wouldn't boot or accept a client) — these are release-blockers. Tag medium/low for ergonomic friction the agent worked around.

Common patterns (reuse these ids when they fit; invent new kebab-case ids for novel ones):
${JUDGE_FINDING_CATALOG.map((c) => `- ${c.id} [${c.lever}]: ${c.hint}`).join('\n')}

Do NOT restate the deterministic findings you are given. Be specific and cite evidence. If a category does not apply, omit it.`;

export async function runJudge(
  input: JudgeInput,
): Promise<{ output?: JudgeOutput; error?: string; model: string }> {
  const model = judgeModel();
  if (!isJudgeEnabled()) {
    return {
      error: 'judge disabled (set ANTHROPIC_API_KEY, AI_GATEWAY_API_KEY, or VERCEL_OIDC_TOKEN)',
      model,
    };
  }
  try {
    // Direct Anthropic uses an unprefixed model id (e.g. `claude-opus-4-8`); the
    // gateway expects the provider-prefixed form (e.g. `anthropic/claude-opus-4-8`).
    const direct = useAnthropicDirect();
    const resolvedModel = direct ? model.replace(/^anthropic\//, '') : model;
    const languageModel = direct
      ? createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(resolvedModel)
      : createGateway({
          apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.VERCEL_OIDC_TOKEN ?? '',
        })(resolvedModel);
    const user = [
      `SCENARIO: ${input.scenario}    AGENT: ${input.agent}`,
      `\nTASK PROMPT:\n${truncate(input.prompt, 2000)}`,
      `\nDETERMINISTIC FINDINGS (already counted — do not restate):\n${
        input.deterministicFindings.length
          ? input.deterministicFindings
              .map((f) => `- ${f.id} [${f.lever}/${f.severity}] ${f.title}`)
              .join('\n')
          : '(none)'
      }`,
      `\nTRANSCRIPT:\n${renderTranscript(input.transcript)}`,
      `\nFINAL CODE:\n${renderCode(input.serverFiles)}`,
    ].join('\n');

    const { object } = await generateObject({
      model: languageModel,
      schema: JudgeSchema,
      system: SYSTEM,
      prompt: user,
      maxRetries: 2,
    });
    return { output: object, model: resolvedModel };
  } catch (e) {
    return { error: e instanceof Error ? e.message : String(e), model };
  }
}
