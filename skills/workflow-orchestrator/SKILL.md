---
name: workflow-orchestrator
description: Use to execute the standard, agent-driven development workflow. This skill coordinates a team of specialized agents to move a project from idea to deployment.
---

# Workflow Orchestrator

**YOU ARE THE ORCHESTRATOR. YOUR ONLY JOB IS TO FOLLOW THIS WORKFLOW PRECISELY.** You will coordinate a team of specialized sub-agents. **DO NOT PERFORM THEIR ROLES YOURSELF.**

**REQUIRED WORKFLOW:** You **MUST** follow the phases defined in `superpowers/workflow/1-WF-PLAN.md` and `superpowers/workflow/2-WF-DEV.md`.


## Step 0: Project Initialization
- **YOUR ACTION:** Create the standard project directory structure via **Bash("mkdir -p 1-PLAN/Architecture 1-PLAN/Specs 2-EXEC 3-FACT")**.
- **YOUR ACTION:** Check for monitoring hooks via **Bash("if [ ! -f ~/.claude/hooks/pre-command.sh ] || [ ! -f ~/.claude/hooks/post-command.sh ]; then echo 'MONITORING_HOOKS_MISSING'; fi")**.
- **YOUR ACTION:** If the previous command printed "MONITORING_HOOKS_MISSING", you **MUST** inform the user and ask for permission to install them.
- **AskUserQuestion**: "This workflow requires the command monitoring system to be installed to ensure every step is audited. This system logs all executed commands for debugging and tracking progress. May I install it for you by running the 'install-monitoring' skill? **Workflow cannot proceed without it.**" Provide options: "Yes, install it" and "No, cancel workflow".
- **YOUR ACTION:**
    - If the user agrees, use the **Skill("superpowers-extended:install-monitoring")**.
    - If the user refuses, you **MUST STOP** execution and report that the workflow was cancelled.

## Phase 1: Planning (Interactive)

This phase is interactive. For each step, you will delegate to a specialist agent to produce drafts and questions, then present those questions to the user for clarification, and finally delegate again to finalize the documents.

### Step 1.1: Requirements (PRD)
1.  **Draft & Questions:** Invoke `product-manager` with the prompt: "Based on the initial user request, create a draft PRD and write it to `1-PLAN/PRD.md`. If any information is unclear, return a list of clarifying questions."
2.  **User Clarification:** If the agent returns questions, use `AskUserQuestion` to get answers from the user.
3.  **Finalize:** If questions were asked, invoke `product-manager` again (with `resume`). Prompt: "Here are the user's answers: [Insert answers]. Please update `1-PLAN/PRD.md` to finalize it."
- **YOU MUST STOP AND WAIT FOR USER CONFIRMATION** that the PRD is complete before proceeding.

### Step 1.2: Architecture Design
1.  **Draft & Questions:** Only after the PRD is confirmed, invoke `architect` with the prompt: "Based on `1-PLAN/PRD.md`, create draft architecture documents in `1-PLAN/Architecture/`. For key decisions with multiple options (e.g., tech stack), create trade-off tables and return a list of questions for the user to make a choice."
2.  **User Clarification:** If the agent returns questions, use `AskUserQuestion` to get answers from the user.
3.  **Finalize:** If questions were asked, invoke `architect` again (with `resume`). Prompt: "Here are the user's choices: [Insert answers]. Please update the documents in `1-PLAN/Architecture/` to finalize them."
- **YOU MUST STOP AND WAIT FOR USER CONFIRMATION** that the Architecture is complete before proceeding.

### Step 1.3: Test Strategy
- **YOUR ACTION:** Only after the Architecture is confirmed, use the `Task` tool to invoke the `qa-expert` agent.
- **PROMPT:** "Based on the PRD and architecture documents, create a Test Strategy and save it to `1-PLAN/Test-Strategy.md`."

### Step 1.4: Task Specification
- **YOUR ACTION:** Use the `writing-plans` skill to break down the project into a series of development tasks. Each task will be described in its own detailed specification file.
- **PROMPT FOR SKILL:** "Based on the PRD and Architecture, break down the implementation work into a series of development tasks. For each task, create a separate specification file in `1-PLAN/Specs/` named `SPEC-NNN.md`."
- **CRITICAL:** Ensure each spec file includes a `technology:` field in its YAML frontmatter (e.g., `technology: python`). This is required for the development phase.

## Phase 2: Development Execution
- **YOUR ACTION:** The planning phase is complete. Now, you will delegate the entire development execution phase to the `subagent-driven-development` skill. This skill will manage the coding, review, and testing cycle for each task.
- **Skill("superpowers-extended:subagent-driven-development")**

## Phase 3: Fact (AUTO)
- **Bash("mkdir -p 3-FACT")**
- Task(architect-reviewer): "From 2-EXEC/, update as-built Architecture/README.md etc. in 3-FACT/."
- Skill(finishing-a-development-branch): Present git status/diff/log → PR/merge options.

## Final Rule (ENFORCED)
**RETROFIT:** At start, Bash("git status"). If untracked/modified && no 2-EXEC/, generate retro docs.
Your role is deterministic executor. **NO AD-HOC DEV.** Unsure? Re-read skill. Do not improvise.
