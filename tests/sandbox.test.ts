import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { prepareWorkspace } from "../src/sandbox.js";

const cleanup: string[] = [];

afterEach(async () => {
  await Promise.all(
    cleanup.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
  );
});

describe("prepareWorkspace task starter", () => {
  it("copies a task-owned starter project into the agent workspace", async () => {
    const taskDir = await mkdtemp(join(tmpdir(), "mcp-use-task-"));
    cleanup.push(taskDir);
    await mkdir(join(taskDir, "starter", "src"), { recursive: true });
    await writeFile(join(taskDir, "starter", "package.json"), "{}");
    await writeFile(
      join(taskDir, "starter", "src", "server.ts"),
      "export const broken = true;"
    );

    const sandbox = await prepareWorkspace(
      { skill: false, scaffold: false },
      { taskDir }
    );
    try {
      await expect(
        readFile(join(sandbox.workspace, "src", "server.ts"), "utf8")
      ).resolves.toContain("broken = true");
    } finally {
      await sandbox.cleanup();
    }
  });
});
