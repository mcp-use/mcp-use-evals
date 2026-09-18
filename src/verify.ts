/** Harbor verifier entry point. No reward file means infrastructure error. */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { collectSourceFiles, collectSourceImports, gradeWorkspace } from "./graders/functional.js";
import { GRADER_VERSION, TaskConfigSchema } from "./types.js";

const [workspace, contract, logs] = process.argv.slice(2);
if (!workspace || !contract || !logs) {
  throw new Error("Usage: verify.ts <workspace> <task.json> <verifier-log-dir>");
}
await mkdir(logs, { recursive: true });
const config = TaskConfigSchema.parse(JSON.parse(await readFile(contract, "utf8")));
const grade = await gradeWorkspace({
  workspace,
  task: {
    config: { ...config, id: basename(dirname(contract)) },
    dir: dirname(contract),
    prompt: "",
    promptHash: "",
  },
});
const experiment = JSON.parse(await readFile(join(dirname(contract), "experiment.json"), "utf8"));
let installedVersion: string | null = null;
try {
  const pkg = JSON.parse(await readFile(join(workspace, "node_modules", experiment.sdk_package, "package.json"), "utf8"));
  installedVersion = pkg.version ?? null;
} catch { /* Missing requested dependency is evidence, not a runtime score. */ }
const sdk = { requestedPackage: experiment.sdk_package, installedVersion,
  importedRequestedSdk: collectSourceImports(await collectSourceFiles(workspace)).some(
    (item) => item.source === experiment.sdk_package || item.source.startsWith(experiment.sdk_package + "/")
  ) };
await writeFile(join(logs, "grade.json"), JSON.stringify({ ...grade, sdk, graderVersion: GRADER_VERSION }, null, 2));
console.log(JSON.stringify(grade, null, 2));
// Write last, only after grading completes. A thrown exception must never be
// disguised as an ordinary contract failure (reward=0).
await writeFile(join(logs, "reward.txt"), grade.contractPass ? "1\n" : "0\n");
