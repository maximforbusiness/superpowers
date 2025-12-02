# Simplified Workflow and Documentation Guide

This document outlines the standard process for project work and documentation, from planning to final delivery.

---

## Phase 1: Planning (Directory: `1-PLAN/`)

This phase focuses on defining what needs to be built.

1.  **Requirements (PRD)**

    *   **Action**: Creates the Product Requirements Document (PRD).
    *   **Responsible Agent**: `product-manager`
    *   **Output**: `1-PLAN/PRD.md`

2.  **Architecture Design**

    *   **Action**: Designs the target system architecture based on the PRD.
    *   **Responsible Agent**: `architect`
    *   **Output**: The following architecture documents in `1-PLAN/Architecture/`:
        *   `frontend.md`
        *   `backend.md`
        *   `database.md`
        *   `infrastructure.md`
        *   `integrations.md` (if applicable)

3.  **Test Strategy**

    *   **Action**: Define the testing approach, scope, and tools.
    *   **Responsible Agent**: `qa-expert` (or a generalist if not available)
    *   **Output**: `1-PLAN/Test-Strategy.md`

4.  **Task Breakdown**

    *   **Action**: Breaks down the project into specific, specs.
    *   **Responsible Agent**: Orchestrator (main agent)
    *   **Outputs**:
        *   `1-PLAN/Plan.md`: The high-level project plan.
        *   `1-PLAN/Specs/SPEC-ID-description.md`: Individual spec files.