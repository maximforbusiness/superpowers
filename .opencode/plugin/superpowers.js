/**
 * Superpowers plugin for OpenCode.ai
 *
 * Provides custom tools for loading and discovering skills,
 * with prompt generation for agent configuration.
 *
 * MODIFIED: Added `run_agent` and `resume_agent` tools to support specialized, isolated sub-agents.
 */

import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';
import { tool } from '@opencode-ai/plugin/tool';
import * as skillsCore from '../../lib/skills-core.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NEW HELPER FUNCTION to find agent definition files.
/**
 * Finds the full path to an agent's .md file within the 'more agents' directory.
 * @param {string} agentName - The name of the agent (e.g., 'product-manager').
 * @param {string} baseDir - The base directory where the 'more agents' folder is located.
 * @returns {string|null} - The full path to the agent file or null if not found.
 */
function findAgentFile(agentName, baseDir) {
    const agentsDir = path.join(baseDir, 'more agents');
    if (!fs.existsSync(agentsDir)) {
        return null;
    }

    const subDirs = fs.readdirSync(agentsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    for (const subDir of subDirs) {
        const agentFilePath = path.join(agentsDir, subDir, `${agentName}.md`);
        if (fs.existsSync(agentFilePath)) {
            return agentFilePath;
        }
    }

    return null;
}


export const SuperpowersPlugin = async ({ client, directory }) => {
  const homeDir = os.homedir();
  const projectSkillsDir = path.join(directory, '.opencode/skills');
  const superpowersBaseDir = path.resolve(__dirname, '../..'); // Root of the superpowers repo
  const superpowersSkillsDir = path.join(superpowersBaseDir, 'skills');
  const personalSkillsDir = path.join(homeDir, '.config/opencode/skills');

  // Helper to generate bootstrap content (unchanged)
  const getBootstrapContent = (compact = false) => {
    const usingSuperpowersPath = skillsCore.resolveSkillPath('using-superpowers', superpowersSkillsDir, personalSkillsDir);
    if (!usingSuperpowersPath) return null;

    const fullContent = fs.readFileSync(usingSuperpowersPath.skillFile, 'utf8');
    const content = skillsCore.stripFrontmatter(fullContent);

    const toolMapping = compact
      ? `**Tool Mapping:** TodoWrite->update_plan, Task->@mention, Skill->use_skill`
      : `**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- \`TodoWrite\` → \`update_plan\`
- \`Task\` tool with subagents → Use OpenCode's subagent system (@mention)
- \`Skill\` tool → \`use_skill\` custom tool
- \`Read\`, \`Write\`, \`Edit\`, \`Bash\` → Your native tools`;

    return `<EXTREMELY_IMPORTANT>
You have superpowers.
**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED. Do NOT use use_skill for "using-superpowers".**
${content}
${toolMapping}
</EXTREMELY_IMPORTANT>`;
  };

  // Helper to inject bootstrap via session.prompt (unchanged)
  const injectBootstrap = async (sessionID, compact = false) => {
    const bootstrapContent = getBootstrapContent(compact);
    if (!bootstrapContent) return false;
    try {
      await client.session.prompt({
        path: { id: sessionID },
        body: {
          noReply: true,
          parts: [{ type: "text", text: bootstrapContent, synthetic: true }]
        }
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    tool: {
      use_skill: tool({ /* ... existing code for use_skill is unchanged ... */
        description: 'Load and read a specific skill to guide your work. Skills contain proven workflows, mandatory processes, and expert techniques.',
        args: {
          skill_name: tool.schema.string().describe('Name of the skill to load (e.g., "superpowers:brainstorming", "my-custom-skill", or "project:my-skill")')
        },
        execute: async (args, context) => {
          const { skill_name } = args;
          const forceProject = skill_name.startsWith('project:');
          const actualSkillName = forceProject ? skill_name.replace(/^project:/, '') : skill_name;
          let resolved = null;
          if (forceProject || !skill_name.startsWith('superpowers:')) {
            const projectPath = path.join(projectSkillsDir, actualSkillName);
            const projectSkillFile = path.join(projectPath, 'SKILL.md');
            if (fs.existsSync(projectSkillFile)) {
              resolved = { skillFile: projectSkillFile, sourceType: 'project', skillPath: actualSkillName };
            }
          }
          if (!resolved && !forceProject) {
            resolved = skillsCore.resolveSkillPath(skill_name, superpowersSkillsDir, personalSkillsDir);
          }
          if (!resolved) {
            return `Error: Skill "${skill_name}" not found. Run find_skills to see available skills.`;
          }
          const fullContent = fs.readFileSync(resolved.skillFile, 'utf8');
          const { name, description } = skillsCore.extractFrontmatter(resolved.skillFile);
          const content = skillsCore.stripFrontmatter(fullContent);
          const skillHeader = `# ${name || skill_name}\n# ${description || ''}`;
          try {
            await client.session.prompt({
              path: { id: context.sessionID },
              body: {
                noReply: true,
                parts: [ { type: "text", text: `Loading skill: ${name || skill_name}`, synthetic: true }, { type: "text", text: `${skillHeader}\n\n${content}`, synthetic: true } ]
              }
            });
          } catch (err) {
            return `${skillHeader}\n\n${content}`;
          }
          return `Launching skill: ${name || skill_name}`;
        }
      }),
      find_skills: tool({ /* ... existing code for find_skills is unchanged ... */
        description: 'List all available skills in the project, personal, and superpowers skill libraries.',
        args: {},
        execute: async () => {
          const projectSkills = skillsCore.findSkillsInDir(projectSkillsDir, 'project', 3);
          const personalSkills = skillsCore.findSkillsInDir(personalSkillsDir, 'personal', 3);
          const superpowersSkills = skillsCore.findSkillsInDir(superpowersSkillsDir, 'superpowers', 3);
          const allSkills = [...projectSkills, ...personalSkills, ...superpowersSkills];
          if (allSkills.length === 0) return 'No skills found.';
          let output = 'Available skills:\n\n';
          for (const skill of allSkills) {
            const namespace = skill.sourceType === 'project' ? 'project:' : (skill.sourceType === 'personal' ? '' : 'superpowers:');
            const skillName = skill.name || path.basename(skill.path);
            output += `${namespace}${skillName}\n`;
            if (skill.description) output += `  ${skill.description}\n`;
            output += `  Directory: ${skill.path}\n\n`;
          }
          return output;
        }
      }),

      // --- NEW TOOLS START HERE ---

      run_agent: tool({
        description: 'Runs a specialized, isolated sub-agent for a specific task.',
        args: {
          agent_name: tool.schema.string().describe('The name of the agent to run (e.g., product-manager, security-auditor).'),
          task_description: tool.schema.string().describe('The detailed task for the agent to perform.'),
        },
        execute: async (args, context) => {
          const { agent_name, task_description } = args;

          const agentFile = findAgentFile(agent_name, superpowersBaseDir);
          if (!agentFile) {
            return `Error: Agent definition file for "${agent_name}" not found.`;
          }

          const system_prompt = fs.readFileSync(agentFile, 'utf8');

          // --- PSEUDOCODE WARNING ---
          // The following block uses a hypothetical API for running sub-agents.
          // This needs to be replaced with the actual API provided by the OpenCode platform.
          try {
            const subAgentSession = await client.agents.run({ // <-- REPLACE WITH REAL API
              system_prompt: system_prompt,
              task: task_description,
              wait_for_completion: true,
              // Potentially pass tools config if needed, e.g.,
              // tools: ['Read', 'Write', 'WebSearch']
            });
            // Assuming the result is on a 'final_output' property
            return subAgentSession.final_output; // <-- REPLACE WITH REAL RESULT ACCESS
          } catch (error) {
            console.error(`Error running agent ${agent_name}:`, error);
            return `Error: Failed to execute agent '${agent_name}'. Check platform API implementation.`;
          }
          // --- END PSEUDOCODE ---
        }
      }),

      resume_agent: tool({
        description: 'Resumes a paused interactive agent with new input.',
        args: {
            session_id: tool.schema.string().describe('The session ID of the paused agent.'),
            user_input: tool.schema.string().describe('The user\'s choice or input to continue.')
        },
        execute: async (args, context) => {
            const { session_id, user_input } = args;

            // --- PSEUDOCODE WARNING ---
            // The following block uses a hypothetical API for resuming agents.
            // This needs to be replaced with the actual API provided by the OpenCode platform.
            try {
                const result = await client.agents.resume({ // <-- REPLACE WITH REAL API
                    session_id: session_id,
                    input: user_input
                });
                return result.final_output; // <-- REPLACE WITH REAL RESULT ACCESS
            } catch (error) {
                console.error(`Error resuming agent session ${session_id}:`, error);
                return `Error: Failed to resume agent session '${session_id}'. Check platform API implementation.`;
            }
            // --- END PSEUDOCODE ---
        }
      }),
    },
    event: async ({ event }) => { /* ... existing event code is unchanged ... */
      const getSessionID = () => {
        return event.properties?.info?.id || event.properties?.sessionID || event.session?.id;
      };
      if (event.type === 'session.created') {
        const sessionID = getSessionID();
        if (sessionID) await injectBootstrap(sessionID, false);
      }
      if (event.type === 'session.compacted') {
        const sessionID = getSessionID();
        if (sessionID) await injectBootstrap(sessionID, true);
      }
    }
  };
};
