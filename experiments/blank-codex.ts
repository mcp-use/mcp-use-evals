import { defineExperiment } from '../scoring/index.js';

// Codex · no skill · no scaffold — the baseline.
export default defineExperiment({ agent: 'vercel-ai-gateway/codex', agentLabel: 'codex', skill: false, scaffold: false });
