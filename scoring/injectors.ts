/**
 * Variant injectors — how the `skill` and `scaffold` treatments are applied to
 * the sandbox before the agent runs (A/B test conditions).
 *
 * These are intentionally thin + overridable. The real payloads are mcp-use
 * assets you drop in:
 *   - skill:    set MCP_USE_SKILL_MD (or replace PLACEHOLDER_SKILL) with the real skill.
 *   - scaffold: set MCP_USE_SCAFFOLD_CMD (e.g. "npx --yes create-mcp-use-app . --yes")
 *               or replace injectScaffold with the real template writer.
 */
import type { Sandbox } from '@vercel/agent-eval';

/** Prepended to the prompt for skill variants so the agent knows the skill exists. */
export const SKILL_PROMPT_PREFIX =
  'You have an mcp-use skill at ./.mcp-use/SKILL.md — read it FIRST. It documents the canonical, current mcp-use server API. Prefer it over guessing or reading dist/.';

const PLACEHOLDER_SKILL = `# mcp-use skill (PLACEHOLDER — replace via MCP_USE_SKILL_MD)

TODO: drop the real mcp-use skill content here. It should cover, at minimum:
- the canonical server entrypoint (\`new MCPServer({ ... })\`), not the legacy factory
- defining a tool with a typed (zod) input schema
- returning results via the response helpers (text/object/markdown/…)
- serving over streamable HTTP and reading process.env.PORT
`;

export async function injectSkill(sandbox: Sandbox): Promise<void> {
  const content = process.env.MCP_USE_SKILL_MD ?? PLACEHOLDER_SKILL;
  await sandbox.writeFiles({ '.mcp-use/SKILL.md': content });
}

export async function injectScaffold(sandbox: Sandbox): Promise<void> {
  const cmd = process.env.MCP_USE_SCAFFOLD_CMD;
  if (cmd) {
    const [bin, ...args] = cmd.split(' ').filter(Boolean);
    if (bin) {
      try {
        await sandbox.runCommand(bin, args);
        return;
      } catch {
        /* fall through to the placeholder marker so the run still proceeds */
      }
    }
  }
  // No scaffold command configured: leave a marker so the experiment stays runnable.
  await sandbox.writeFiles({
    '.mcp-use/SCAFFOLD_TODO.md':
      'TODO: inject the create-mcp-use-app scaffold here (set MCP_USE_SCAFFOLD_CMD or edit scoring/injectors.ts).',
  });
}
