import type { Lever, Severity } from './types.js';

/** Points subtracted from the API-correctness dimension (weight 20) per fired lint. */
export const SEVERITY_DEDUCTION: Record<Severity, number> = {
  low: 4,
  medium: 8,
  high: 14,
};

/**
 * Catalog of judge findings — guidance baked into the judge prompt. These mirror
 * the `judge:*` tags discovered in the v1 run. The judge MAY surface novel ids
 * too (those become candidates to "graduate" into deterministic lints).
 */
export const JUDGE_FINDING_CATALOG: { id: string; lever: Lever; hint: string }[] = [
  {
    id: 'struggled-to-find-api',
    lever: 'docs',
    hint: 'spent many steps discovering the public API (grep, trial-and-error, reading types)',
  },
  {
    id: 'read-dist-to-discover-api',
    lever: 'sdk',
    hint: 'had to read dist/ or .d.ts to find a class/helper because exports were not discoverable',
  },
  {
    id: 'hallucinated-api',
    lever: 'sdk',
    hint: 'called an API that does not exist / wrong signature, then corrected after a type error',
  },
  {
    id: 'sdk-install-conflict',
    lever: 'sdk',
    hint: 'install failed or needed workarounds due to the SDK\'s packaging — peer-dependency ranges, ERESOLVE, missing/incorrect deps',
  },
  {
    id: 'sdk-startup-broke',
    lever: 'sdk',
    hint: 'the server would not boot or accept a client out of the box — listen()/bind defaults, IPv6 vs 127.0.0.1, or a side-effect that blocked startup (HIGH severity: blocked a correct user)',
  },
  {
    id: 'sdk-module-resolution',
    lever: 'sdk',
    hint: 'ESM/CJS or .js↔.ts specifier resolution friction — e.g. won\'t run under node strip-types without tsx, or wrong exports/moduleResolution',
  },
  {
    id: 'fought-template',
    lever: 'template',
    hint: 'deleted or fought scaffold/template files instead of building on them',
  },
  {
    id: 'no-self-verification',
    lever: 'process',
    hint: 'never verified its own work (no build/run/client check) before finishing',
  },
  {
    id: 'hand-rolled-helper',
    lever: 'skill',
    hint: 'hand-rolled something the SDK provides a first-class helper for',
  },
  {
    id: 'thrashing',
    lever: 'process',
    hint: 'repeated edit/typecheck loops on the same spot without making progress',
  },
];
