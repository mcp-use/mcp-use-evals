import { cp, mkdir, mkdtemp, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "./proc.js";
import { SKILL_DIR, SKILL_NAME } from "./tasks.js";
import type { Variant } from "./types.js";

export interface Sandbox {
  /** the agent's working directory */
  workspace: string;
  cleanup: () => Promise<void>;
}

export type SkillTarget = "claude" | "codex";

const SCAFFOLD_TIMEOUT_MS = 10 * 60_000;

/**
 * Prepare a fresh workspace for one trial.
 * - scaffold variants run create-mcp-use-app (starter template, deps installed)
 * - blank variants get a truly empty directory
 * - skill variants get the mcp-apps-builder skill copied into the selected agent's
 *   project skill directory
 *
 * Workspaces live in the OS tmpdir (NOT inside the repo) so the sandbox can't
 * resolve modules from the monorepo's node_modules — a missing dependency must
 * fail, not silently leak from the repo.
 */
export async function prepareWorkspace(
  variant: Variant,
  opts: { skillTarget?: SkillTarget; taskDir?: string } = {}
): Promise<Sandbox> {
  const root = await mkdtemp(join(tmpdir(), "mcpuse-eval-"));
  const workspace = join(root, "app");

  if (variant.scaffold) {
    const res = await run(
      "npx",
      [
        "-y",
        "create-mcp-use-app@latest",
        "app",
        "--template",
        "starter",
        "--no-skills",
        "--no-git",
        "--npm",
        "--install",
      ],
      { cwd: root, timeoutMs: SCAFFOLD_TIMEOUT_MS }
    );
    if (res.code !== 0) {
      await rm(root, { recursive: true, force: true });
      throw new Error(
        `create-mcp-use-app failed (exit ${res.code}${res.timedOut ? ", timed out" : ""}):\n${tail(res.stderr || res.stdout)}`
      );
    }
  } else {
    await mkdir(workspace, { recursive: true });
  }

  if (opts.taskDir) {
    const starter = join(opts.taskDir, "starter");
    if (await exists(starter)) {
      await cp(starter, workspace, { recursive: true });
    }
  }

  if (variant.skill) {
    const dest = join(workspace, skillRoot(opts.skillTarget), SKILL_NAME);
    await mkdir(dest, { recursive: true });
    await cp(SKILL_DIR, dest, {
      recursive: true,
      filter: (src) => !src.includes(`${join(SKILL_NAME, "evals")}`),
    });
  }

  return {
    workspace,
    cleanup: () => rm(root, { recursive: true, force: true }),
  };
}

async function exists(path: string): Promise<boolean> {
  return access(path).then(
    () => true,
    () => false
  );
}

/** Copy a task's golden solution over the workspace (grader-calibration mode). */
export async function applyGolden(
  taskDir: string,
  workspace: string
): Promise<void> {
  const golden = join(taskDir, "golden");
  await access(golden); // throws if the task has no golden solution
  await cp(golden, workspace, { recursive: true });
}

/** Copy the agent-authored sources (sans node_modules etc.) into the results dir. */
export async function snapshotWorkspace(
  workspace: string,
  dest: string
): Promise<void> {
  const EXCLUDE = new Set([
    "node_modules",
    ".git",
    "dist",
    ".mcp-use",
    ".claude",
    ".codex",
    ".env",
    ".mcp-use-eval-env.sh",
  ]);
  await cp(workspace, dest, {
    recursive: true,
    filter: (src) => {
      const parts = src.split("/");
      return !parts.some((p) => EXCLUDE.has(p));
    },
  });
}

export function skillRoot(target: SkillTarget = "claude"): string {
  return target === "codex"
    ? join(".codex", "skills")
    : join(".claude", "skills");
}

function tail(s: string, n = 2000): string {
  return s.length > n ? `…${s.slice(-n)}` : s;
}
