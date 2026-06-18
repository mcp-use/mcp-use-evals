import { defineExperiment } from '../scoring/index.js';

// Claude Code · no skill · create-mcp-use-app scaffold.
export default defineExperiment({ agent: 'claude-code', agentLabel: 'cc', skill: false, scaffold: true });
