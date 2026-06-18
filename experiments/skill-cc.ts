import { defineExperiment } from '../scoring/index.js';

// Claude Code · mcp-use skill · no scaffold.
export default defineExperiment({ agent: 'claude-code', agentLabel: 'cc', skill: true, scaffold: false });
