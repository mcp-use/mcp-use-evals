import type { Finding, Lever } from './types.js';
import { LEVERS } from './types.js';

export function emptyLeverTally(): Record<Lever, number> {
  return { docs: 0, template: 0, sdk: 0, skill: 0, process: 0 };
}

export function tallyLevers(findings: Finding[]): Record<Lever, number> {
  const tally = emptyLeverTally();
  for (const f of findings) tally[f.lever] = (tally[f.lever] ?? 0) + 1;
  return tally;
}

export function isLever(x: unknown): x is Lever {
  return typeof x === 'string' && (LEVERS as readonly string[]).includes(x);
}
