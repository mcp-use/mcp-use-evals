import { defineExperiment } from '../scoring/index.js';

// Claude Code · no skill · no scaffold — the baseline.
export default defineExperiment({ agent: 'claude-code', agentLabel: 'cc', skill: false, scaffold: false });
