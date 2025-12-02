# Simplified Workflow and Documentation Guide

This document outlines the standard process for project work and documentation, from planning to final delivery.

---

## Phase 2: Execution (Directory: `2-EXEC/`)

This phase is a cycle performed for each individual task. All work is tracked in a central report file for the task.

1.  **Task Specification**
    *   **Action**: Creates a detailed technical plan for the task.
    *   **Responsible Agent**: Orchestrator (main agent)
    *   **Output**: `2-EXEC/Specs/TASK-ID-spec.md`

2.  **Implementation**
    *   **Action**: Writes the code to complete the task.
    *   **Responsible Agent**: Technology-specific agent (e.g., `python-pro`, `react-specialist`)
    *   **Output**:
        *   Code changes.
        *   Initial `2-EXEC/Reports/TASK-ID-report.md` to track progress.

3.  **Code Review**
    *   **Action**: Reviews code for quality, standards, and basic security.
    *   **Responsible Agent**: `code-reviewer`
    *   **Result**:
        *   `APPROVED`: Proceeds to Testing.
        *   `REJECTED`: Returns to the Coder for revisions.

4.  **Testing**
    *   **Action**: Writes and runs unit and integration tests.
    *   **Responsible Agent**: `test-automator` (or the implementation agent)
    *   **Result**:
        *   `PASSED`: Proceeds to Security Audit.
        *   `FAILED`: Returns to the Coder for revisions.

5.  **Security Audit**
    *   **Action**: Performs a deep security analysis and vulnerability scan.
    *   **Responsible Agent**: `security-auditor`
    *   **Result**:
        *   `CLEARED`: Proceeds to Observability.
        *   `ISSUES_FOUND`: Returns to the Coder for revisions following the security failure flow.

6.  **Observability Setup**
    *   **Action**: Integrates logging, metrics, and monitoring.
    *   **Responsible Agent**: `devops-engineer` (or a generalist)

7.  **Deployment Preparation**
    *   **Action**: Prepares deployment scripts and artifacts.
    *   **Responsible Agent**: `devops-engineer` (or a generalist)
    *   **Final Step**: Marks the task as `COMPLETE` in the project's central status file.

---

## Phase 3: Documentation (Directory: `3-FACT/`)

This final phase ensures the documentation reflects the final state of the project.

1.  **Architecture Sync**
    *   **Action**: Updates the "as-is" architecture to match the implemented code.
    *   **Output**: Updated documents in `3-FACT/Architecture/`.

2.  **Final README**
    *   **Action**: Creates the final, user-facing documentation.
    *   **Output**: `3-FACT/README.md` with setup and usage instructions.
---

## Appendix: Example `0-DOCS` Structure

Below is an example of what the final `0-DOCS` directory might look like for a project with two tasks.

```
0-DOCS/
├── 1-PLAN/
│   ├── Architecture/
│   │   ├── frontend.md
│   │   ├── backend.md
│   │   ├── database.md
│   │   ├── infrastructure.md
│   │   └── integrations.md
│   ├── Tasks/
│   │   ├── TASK-001-user-authentication.md
│   │   └── TASK-002-profile-page.md
│   ├── Plan.md
│   ├── PRD.md
│   └── Test-Strategy.md
│
├── 2-EXEC/
│   ├── Reports/
│   │   ├── TASK-001-report.md
│   │   └── TASK-002-report.md
│   └── Specs/
│       ├── TASK-001-spec.md
│       └── TASK-002-spec.md
│
└── 3-FACT/
    ├── Architecture/
    │   ├── frontend.md     # As-is
    │   ├── backend.md      # As-is
    │   ├── database.md     # As-is
    │   ├── infrastructure.md # As-is
    │   └── integrations.md # As-is
    └── README.md
```
---

## Appendix B: Documenting Problems

A key part of maintaining a healthy project is documenting significant problems and their resolutions. This builds a valuable knowledge base.

**When to Document a Problem:**
- You encounter a bug that takes more than 30 minutes to solve.
- You face a significant architectural challenge.
- You discover unexpected behavior in a framework or library.

**How to Document:**

1.  **Open or Create the Log**: Find the `0-DOCS/3-FACT/problems.md` file. If it doesn't exist, create it.

2.  **Add a New Entry**: Add a new problem to the log.

3.  **Fill in the Details**:
    *   **Description**: What are the symptoms? Include error messages.
    *   **What Was Tried**: List the steps you took to debug the issue.
    *   **Root Cause**: Explain the fundamental reason for the problem.
    *   **Solution**: Describe the fix that worked.
    *   **Prevention**: What can be done to prevent this from happening again?