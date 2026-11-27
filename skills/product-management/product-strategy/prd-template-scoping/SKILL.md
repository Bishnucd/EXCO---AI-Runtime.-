---
name: prd-template-scoping
description: Generates structured, developer-actionable Product Requirements Documents (PRDs) with user personas, success metrics, technical scope, and out-of-scope boundaries. Use when scoping new software features, defining product milestones, or initiating engineering sprints.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://svpg.com/articles/"
---

# PRD Template Scoping

## Overview
A Product Requirements Document (PRD) aligns product managers, engineering leads, designers, and stakeholders on what problem is being solved, who it serves, and how success is measured. This skill guides the systematic generation of comprehensive, unambiguous PRDs that eliminate scope creep.

## Operational Workflow

1. **Problem Statement & Business Context**:
   - Articulate the core user friction point and root cause.
   - Define business value: expected revenue impact, customer churn reduction, or operational efficiency gain.
   - Outline target customer personas with role, goals, and technical sophistication.

2. **Goals and Success Metrics (OKRs & KPIs)**:
   - Establish Primary Metric (e.g. 20% increase in checkout completion).
   - Establish Secondary / Guardrail Metrics (e.g. zero degradation in page load latency, support ticket volume stays below 2%).

3. **User Stories & Acceptance Criteria**:
   - Write standard user stories: `As a [persona], I want to [action] so that [benefit]`.
   - Provide Gherkin-formatted acceptance criteria:
     ```gherkin
     Given a user with a valid active session
     When they click "Export CSV"
     Then an async export job triggers and a download URL appears within 3 seconds
     ```

4. **Technical Boundaries & Scope Tranche**:
   - Enumerate **In-Scope (P0 / MVP)**: Minimum viable features necessary for initial release.
   - Enumerate **P1 / Next Iteration**: Follow-on enhancements scheduled for subsequent sprints.
   - Explicitly list **Out-of-Scope**: Non-goals that the engineering team must not build.

5. **Release Plan and Dependencies**:
   - Document cross-team dependencies (backend APIs, design system components, legal sign-off).
   - Outline rollout phases: internal dogfooding, beta testing flag, phased production rollout (10% -> 50% -> 100%).
