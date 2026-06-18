/**
 * Variant injectors — how the `skill` and `scaffold` treatments are applied to
 * the sandbox before the agent runs (the A/B test conditions).
 *
 *   - skill:    install the real mcp-use `mcp-apps-builder` skill into the
 *               agent's skills directory (cc → .claude/skills, codex →
 *               .codex/skills), exactly like `create-mcp-use-app --skills` does,
 *               and prepend a prompt prefix so the agent reads it first.
 *   - scaffold: run the real `create-mcp-use-app --template mcp-apps` to seed the
 *               workspace with a genuine mcp-use project, then build on top of it.
 *
 * Both source the same assets a real user would get.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Sandbox } from '@vercel/agent-eval';

const SCORING_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCORING_DIR, '..');

// ---------------------------------------------------------------------------
// skill
// ---------------------------------------------------------------------------

/** The skill `create-mcp-use-app --skills` installs (see its addSkillsToProject). */
const SKILL_NAME = 'mcp-apps-builder';

/**
 * The skill source — a vendored snapshot in this repo, which pins the exact skill
 * version a scorecard was produced with. Re-sync by copying from a local mcp-use
 * checkout (`$DEV/mcp-use/skills/mcp-apps-builder`).
 */
const SKILL_SOURCE_DIR = path.join(REPO_ROOT, 'assets', 'skills', SKILL_NAME);

/** Agent label → the skills directory that agent auto-discovers. */
const SKILL_DEST_BASE: Record<string, string> = {
  cc: '.claude/skills',
  codex: '.codex/skills',
};

/** Sandbox-relative directory the skill is installed into for a given agent. */
function skillInstallDir(agentLabel: string): string {
  const base = SKILL_DEST_BASE[agentLabel] ?? SKILL_DEST_BASE.cc;
  return `${base}/${SKILL_NAME}`;
}

/**
 * Prompt prefix telling the agent the skill exists and where to read it. Kept
 * explicit because not every agent auto-loads project skills the same way.
 */
export function skillPromptPrefix(agentLabel: string): string {
  const skillMd = `./${skillInstallDir(agentLabel)}/SKILL.md`;
  return [
    `You have the mcp-use "${SKILL_NAME}" skill installed in this workspace at ${skillMd} —`,
    `read it FIRST. It is the canonical, current guide to building MCP servers with the`,
    `mcp-use TypeScript SDK; follow the reference files it points to. Prefer it over`,
    `guessing the API or reading dist/.`,
  ].join(' ');
}

/** Back-compat default (cc) for callers that import the constant. */
export const SKILL_PROMPT_PREFIX = skillPromptPrefix('cc');

/** Recursively read every file under `dir` into { posixRelativePath: utf8 content }. */
async function collectFiles(dir: string): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  async function walk(current: string): Promise<void> {
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile()) {
        const rel = path.relative(dir, full).split(path.sep).join('/');
        out[rel] = await readFile(full, 'utf-8');
      }
    }
  }
  await walk(dir);
  return out;
}

/**
 * Install the mcp-apps-builder skill tree into the agent's skills directory,
 * mirroring `create-mcp-use-app --skills`.
 */
export async function injectSkill(sandbox: Sandbox, agentLabel: string): Promise<void> {
  const files = await collectFiles(SKILL_SOURCE_DIR);
  if (Object.keys(files).length === 0) {
    throw new Error(`injectSkill: no skill files found under ${SKILL_SOURCE_DIR}`);
  }
  const installDir = skillInstallDir(agentLabel);
  const payload: Record<string, string> = {};
  for (const [rel, content] of Object.entries(files)) {
    payload[`${installDir}/${rel}`] = content;
  }
  await sandbox.writeFiles(payload);
}

// ---------------------------------------------------------------------------
// scaffold
// ---------------------------------------------------------------------------

/** npm spec for the scaffolder; pin a version here for reproducibility if needed. */
const SCAFFOLD_PKG = 'create-mcp-use-app';
/** Template passed to `--template`. */
const SCAFFOLD_TEMPLATE = 'mcp-apps';
/** Temp subdir we scaffold into before overlaying onto the workspace. */
const SCAFFOLD_TMP = '_scaffold';
/**
 * Kept so EVAL.ts (which `import`s vitest and runs `npm run build`) still resolves
 * vitest after the template's package.json replaces the scenario's. Matches the
 * version the scenarios pin.
 */
const VITEST_VERSION = '^2.1.0';

/**
 * Seed the workspace with a real `create-mcp-use-app` project (mcp-apps template).
 *
 * The scenario's package.json/tsconfig.json are uploaded into the workspace
 * *before* this runs, and create-mcp-use-app refuses a non-empty target dir, so
 * we scaffold into a temp subdir and overlay it (scaffold wins). The scaffolded
 * project keeps its own `build` (`mcp-use build`) — that becomes the build gate
 * for scaffold variants. We add vitest back so the eval's gate still runs.
 */
export async function injectScaffold(sandbox: Sandbox): Promise<void> {
  // 1. Scaffold into a temp subdir, fully non-interactive.
  //    --no-install: the harness runs `npm install` after setup.
  //    --no-skills:  keep the scaffold independent of the skill treatment.
  const create = await sandbox.runCommand('npx', [
    '--yes',
    SCAFFOLD_PKG,
    SCAFFOLD_TMP,
    '--template',
    SCAFFOLD_TEMPLATE,
    '--no-install',
    '--no-skills',
    '--no-git',
    '--npm',
  ]);
  if (create.exitCode !== 0) {
    const tail = (create.stdout + create.stderr).trim().split('\n').slice(-15).join('\n');
    throw new Error(`injectScaffold: create-mcp-use-app failed (exit ${create.exitCode}):\n${tail}`);
  }

  // 2. Patch vitest back in, drop any bundled node_modules/.git, then overlay the
  //    scaffold onto the workspace and remove the temp dir. `cp -R src/. dst`
  //    copies contents (incl. dotfiles) without nesting the dir inside itself.
  const overlay = await sandbox.runCommand('bash', [
    '-c',
    [
      'set -euo pipefail',
      `cd ${SCAFFOLD_TMP}`,
      `npm pkg set "devDependencies.vitest=${VITEST_VERSION}"`,
      'rm -rf node_modules .git',
      'cd ..',
      `cp -R ${SCAFFOLD_TMP}/. .`,
      `rm -rf ${SCAFFOLD_TMP}`,
    ].join(' && '),
  ]);
  if (overlay.exitCode !== 0) {
    const tail = (overlay.stdout + overlay.stderr).trim().split('\n').slice(-15).join('\n');
    throw new Error(`injectScaffold: overlay failed (exit ${overlay.exitCode}):\n${tail}`);
  }
}
