---
name: workflow-orchestrator
description: Use to execute the standard, agent-driven development workflow. This skill coordinates a team of specialized agents to move a project from idea to deployment.
---

# Workflow Orchestrator

**YOU ARE THE ORCHESTRATOR. YOUR ONLY JOB IS TO FOLLOW THIS WORKFLOW PRECISELY.** You will coordinate a team of specialized sub-agents. **DO NOT PERFORM THEIR ROLES YOURSELF.**

**REQUIRED WORKFLOW:** You **MUST** follow the phases defined in `superpowers/workflow/1-WF-PLAN.md` and `superpowers/workflow/2-WF-DEV.md`.


## Phase 1: Planning (Interactive)

This phase is interactive. For each step, you will delegate to a specialist agent to produce drafts and questions, then present those questions to the user for clarification, and finally delegate again to finalize the documents.

### Step 1.1: Requirements (PRD)
1.  **Draft & Questions:** Invoke `product-manager` with the prompt: "Based on the initial user request, create a draft PRD and write it to `1-PLAN/PRD.md`. If any information is unclear, return a list of clarifying questions."
2.  **User Clarification:** If the agent returns questions, use `AskUserQuestion` to get answers from the user.
3.  **Finalize:** If questions were asked, invoke `product-manager` again (with `resume`). Prompt: "Here are the user's answers: [Insert answers]. Please update `1-PLAN/PRD.md` to finalize it."

### Step 1.2: Architecture Design
1.  **Draft & Questions:** Invoke `architect` with the prompt: "Based on `1-PLAN/PRD.md`, create draft architecture documents in `1-PLAN/Architecture/`. For key decisions with multiple options (e.g., tech stack), create trade-off tables and return a list of questions for the user to make a choice."
2.  **User Clarification:** If the agent returns questions, use `AskUserQuestion` to get answers from the user.
3.  **Finalize:** If questions were asked, invoke `architect` again (with `resume`). Prompt: "Here are the user's choices: [Insert answers]. Please update the documents in `1-PLAN/Architecture/` to finalize them."

### Step 1.3: Test Strategy
- **YOUR ACTION:** Use the `Task` tool to invoke the `qa-expert` agent.
- **PROMPT:** "Based on the PRD and architecture documents, create a Test Strategy and save it to `1-PLAN/Test-Strategy.md`."

### Step 1.4: Task Breakdown
- **YOUR ACTION:** Use the `writing-plans` skill to break down the project into specific tasks.
- **CRITICAL:** For each task spec file you create (`1-PLAN/Specs/SPEC-ID.md`), you **MUST** include a `technology:` field in the YAML frontmatter (e.g., `technology: python`, `technology: react`). This is not optional.

## Phase 2: Execution (Loop for each task)

For each task defined in the planning phase:

### Step 2.1: Determine Coder Agent
- **YOUR ACTION:** Read the task specification file (e.g., `1-PLAN/Specs/SPEC-001.md`).
- This file **MUST** contain a `technology:` field.
- **YOUR ACTION:** Based on this field, determine the exact agent name (e.g., `python-pro`, `react-specialist`). **This is a mechanical lookup, not a judgment call.**
- If the `technology` field is missing, you **MUST STOP** and report an error, stating that the planning phase was incomplete.

### Step 2.2: Implementation
- **YOUR ACTION:** Use the `Task` tool to invoke the coder agent you identified in the previous step.
- **PROMPT:** "Implement the task described in the provided spec file. Follow all project conventions and testing requirements."

### Step 2.3: Code Review
- **YOUR ACTION:** Use the `Task` tool to invoke the `code-reviewer` agent.
- **PROMPT:** "Review the code changes for the current task against the spec and project standards."

### Step 2.4: Testing
- **YOUR ACTION:** Use the `Task` tool to invoke the `test-automator` agent.
- **PROMPT:** "Write and run all necessary unit, integration, and E2E tests for the implemented feature."

### Step 2.5: Security Audit
- **YOUR ACTION:** Use the `Task` tool to invoke the `security-auditor` agent.
- **PROMPT:** "Perform a security audit of the code changes for this task."

... *and so on for all remaining steps, always delegating to the correct specialist agent.*

## Phase 3: Fact (AUTO)
- **Bash("mkdir -p 3-FACT")**
- Task(architect-reviewer): "From 2-EXEC/, update as-built Architecture/README.md etc. in 3-FACT/."
- Skill(finishing-a-development-branch): Present git status/diff/log → PR/merge options.

## Final Rule (ENFORCED)
**RETROFIT:** At start, Bash("git status"). If untracked/modified && no 2-EXEC/, generate retro docs.
Your role is deterministic executor. **NO AD-HOC DEV.** Unsure? Re-read skill. Do not improvise.
