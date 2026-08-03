import { parseArgs } from "node:util";
import { gradeWorkspace } from "./graders/functional.js";
import { applyGolden, prepareWorkspace } from "./sandbox.js";
import { listTaskIds, loadTask } from "./tasks.js";

const HELP = `verify-tasks — grade every task's known-good solution (tasks/<id>/golden/)

Proves the grader/task pair isn't broken: no agent, no judge, no API keys.
Every task must pass 100% or this exits 1 (gates CI before burning agent runs).

Usage: pnpm verify-tasks [options]

  --task <id>   task to verify (repeatable; default: all tasks)
  --help
`;

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      task: { type: "string", multiple: true },
      help: { type: "boolean", default: false },
    },
  });
  if (values.help) {
    console.log(HELP);
    return;
  }

  const taskIds =
    values.task && values.task.length > 0 ? values.task : await listTaskIds();

  const rows: Array<{ task: string; pass: boolean; failures: string[] }> = [];

  for (const taskId of taskIds) {
    const task = await loadTask(taskId);
    const sandbox = await prepareWorkspace({ skill: false, scaffold: false });
    try {
      await applyGolden(task.dir, sandbox.workspace);
      const grade = await gradeWorkspace({ workspace: sandbox.workspace, task });
      const failures = grade.checks
        .filter((c) => !c.pass)
        .map((c) => `${c.id}: ${c.detail ?? "failed"}`);
      rows.push({ task: taskId, pass: grade.contractPass, failures });
    } finally {
      await sandbox.cleanup().catch(() => {});
    }
  }

  printTable(rows);

  if (rows.some((r) => !r.pass)) {
    process.exitCode = 1;
  }
}

function printTable(
  rows: Array<{ task: string; pass: boolean; failures: string[] }>
): void {
  const width = Math.max(4, ...rows.map((r) => r.task.length));
  console.log(`\n${"task".padEnd(width)}  result`);
  console.log(`${"-".repeat(width)}  ------`);
  for (const row of rows) {
    console.log(
      `${row.task.padEnd(width)}  ${row.pass ? "PASS ✅" : "FAIL ❌"}`
    );
    for (const failure of row.failures) {
      console.log(`${" ".repeat(width)}    - ${failure}`);
    }
  }
  const passed = rows.filter((r) => r.pass).length;
  console.log(`\n${passed}/${rows.length} tasks pass their golden solution`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
