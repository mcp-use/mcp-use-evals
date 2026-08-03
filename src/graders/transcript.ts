/**
 * Render a harness-stream transcript.jsonl into readable text for the LLM
 * judge. Two event-stream shapes exist in the wild (see src/agent.ts):
 *
 *  - the legacy claude-code CLI stream: {type: "system"|"assistant"|"user"|
 *    "result"} with Anthropic-shaped `message.content` blocks.
 *  - the AI SDK harness stream: {type: "text-delta"|"tool-call"|
 *    "tool-result"|"tool-error"|"error"|"diagnostic"|"finish"|"finish-step"|
 *    "result"|"harness"}.
 *
 * Unlike the old renderer used for the readiness judge (200-char tool-result
 * cap), this keeps far more of each tool result — the point of this module
 * is to give the judge enough fidelity to quote verbatim evidence.
 */

const MAX_TOOL_INPUT_CHARS = 1000;
const DEFAULT_MAX_TOOL_RESULT_CHARS = 2000;
const DEFAULT_MAX_TOTAL_CHARS = 150_000;

/** Event types unique to the AI SDK harness stream (vs the claude-code CLI stream). */
const HARNESS_STREAM_TYPES = new Set([
  "text-delta",
  "tool-call",
  "tool-result",
  "tool-error",
  "finish",
  "finish-step",
  "diagnostic",
]);

export function renderJudgeTranscript(
  rawJsonl: string,
  opts?: { maxToolResultChars?: number; maxTotalChars?: number }
): string {
  const maxToolResultChars =
    opts?.maxToolResultChars ?? DEFAULT_MAX_TOOL_RESULT_CHARS;
  const maxTotalChars = opts?.maxTotalChars ?? DEFAULT_MAX_TOTAL_CHARS;

  const events = parseEvents(rawJsonl);
  const rendered = events.some(
    (e) => typeof e.type === "string" && HARNESS_STREAM_TYPES.has(e.type)
  )
    ? renderHarnessStream(events, maxToolResultChars)
    : renderClaudeCliStream(events, maxToolResultChars);

  return truncateMiddle(rendered, maxTotalChars);
}

/** Defensive JSONL parse: malformed/blank lines are skipped, never thrown. */
function parseEvents(rawJsonl: string): Record<string, unknown>[] {
  const events: Record<string, unknown>[] = [];
  for (const line of rawJsonl.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        events.push(parsed as Record<string, unknown>);
      }
    } catch {
      // skip malformed lines
    }
  }
  return events;
}

function renderClaudeCliStream(
  events: Record<string, unknown>[],
  maxToolResultChars: number
): string {
  const out: string[] = [];
  for (const e of events) {
    if (e.type === "assistant" || e.type === "user") {
      const message = e.message as { content?: unknown } | undefined;
      const content = Array.isArray(message?.content) ? message.content : [];
      for (const block of content as Record<string, unknown>[]) {
        if (
          block.type === "text" &&
          typeof block.text === "string" &&
          block.text.trim()
        ) {
          out.push(block.text.trim());
        } else if (block.type === "tool_use") {
          out.push(
            `\`[tool] ${String(block.name)}(${truncate(JSON.stringify(block.input ?? {}), MAX_TOOL_INPUT_CHARS)})\``
          );
        } else if (block.type === "tool_result") {
          const isError = block.is_error === true;
          const text = truncate(
            flattenToolResult(block.content),
            maxToolResultChars
          );
          out.push(`\`[result${isError ? " ERROR" : ""}]\` ${text}`);
        }
      }
    } else if (e.type === "result") {
      const status = e.subtype === "success" ? "" : ` ${String(e.subtype)}`;
      out.push(
        `---\n[run result]${status} turns=${e.num_turns ?? "?"} cost=$${e.total_cost_usd ?? "?"} duration=${e.duration_ms ?? "?"}ms`
      );
    } else if (e.type === "harness") {
      out.push(`---\n[harness] ${String(e.note)}`);
    }
  }
  return out.join("\n\n");
}

function renderHarnessStream(
  events: Record<string, unknown>[],
  maxToolResultChars: number
): string {
  const out: string[] = [];
  let text = "";
  const flushText = () => {
    const trimmed = text.trim();
    if (trimmed) out.push(trimmed);
    text = "";
  };

  for (const e of events) {
    if (e.type === "text-delta" && typeof e.text === "string") {
      text += e.text;
    } else if (e.type === "tool-call") {
      flushText();
      out.push(
        `\`[tool] ${String(e.toolName)}(${truncate(JSON.stringify(e.input ?? {}), MAX_TOOL_INPUT_CHARS)})\``
      );
    } else if (e.type === "tool-result") {
      flushText();
      out.push(
        `\`[result]\` ${truncate(flattenToolResult(e.output), maxToolResultChars)}`
      );
    } else if (e.type === "tool-error") {
      flushText();
      out.push(
        `\`[result ERROR]\` ${truncate(flattenToolResult(e.error), maxToolResultChars)}`
      );
    } else if (e.type === "error") {
      flushText();
      out.push(
        `---\n[harness] ${truncate(flattenToolResult(e.error), maxToolResultChars)}`
      );
    } else if (e.type === "diagnostic") {
      flushText();
      out.push(`---\n[diagnostic:${String(e.level)}] ${String(e.message)}`);
    } else if (e.type === "result") {
      flushText();
      const status = e.subtype === "success" ? "" : ` ${String(e.subtype)}`;
      out.push(
        `---\n[run result]${status} turns=${e.num_turns ?? "?"} duration=${e.duration_ms ?? "?"}ms`
      );
    } else if (e.type === "harness") {
      flushText();
      out.push(`---\n[harness] ${String(e.note)}`);
    }
  }
  flushText();
  return out.join("\n\n");
}

/**
 * Tool outputs in the harness stream are often plain objects (e.g. bash's
 * {exitCode, stdout, stderr}) rather than the claude-code CLI's content-block
 * arrays. Render stdout/stderr as-is so the judge can quote the literal
 * output text instead of an escaped JSON blob.
 */
function flattenToolResult(content: unknown): string {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((c) =>
        typeof c === "object" && c !== null && "text" in c
          ? String((c as { text: unknown }).text)
          : ""
      )
      .join(" ");
  }
  if (typeof content === "object" && content !== null) {
    const obj = content as Record<string, unknown>;
    if (typeof obj.stdout === "string" || typeof obj.stderr === "string") {
      const parts: string[] = [];
      if (typeof obj.stdout === "string" && obj.stdout) parts.push(obj.stdout);
      if (typeof obj.stderr === "string" && obj.stderr)
        parts.push(`[stderr] ${obj.stderr}`);
      if (typeof obj.exitCode === "number" && obj.exitCode !== 0)
        parts.push(`[exitCode] ${obj.exitCode}`);
      if (parts.length) return parts.join("\n");
    }
  }
  return JSON.stringify(content ?? "");
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

function truncateMiddle(s: string, max: number): string {
  if (s.length <= max) return s;
  const half = Math.floor(max / 2);
  const cut = s.length - max;
  return `${s.slice(0, half)}\n\n[... truncated ${cut} chars ...]\n\n${s.slice(-half)}`;
}
