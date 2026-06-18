import { execSync } from 'node:child_process';
import { test, expect } from 'vitest';

// Baseline scenario: asserts the agent produced a project that typechecks.
// Only the prompt was ported from the old mcp-use-evals harness — the functional
// probe / golden grading is intentionally NOT copied (baseline-only, like the other ported scenarios).
test('project typechecks (npm run build)', () => {
  // execSync throws on a non-zero exit, which fails the test.
  execSync('npm run build', { stdio: 'pipe' });
  expect(true).toBe(true);
});
