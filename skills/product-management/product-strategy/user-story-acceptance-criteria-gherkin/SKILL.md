---
name: user-story-acceptance-criteria-gherkin
description: Drafts agile user stories with testable Given-When-Then (Gherkin) acceptance criteria. Use when specifying developer-actionable user stories for sprint backlogs.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cucumber.io/docs/gherkin/reference/"
---
# User Story Acceptance Criteria Gherkin

## Overview
Ambiguous user stories lead to rework and disputed sprint deliveries. Structuring stories as role-action-benefit with Gherkin acceptance criteria guarantees clear testable boundaries.

## Operational Workflow

1. **Structure story statement**:
   - Structure story statement: As a <persona>, I want <capability>, so that <business value>.

2. **Draft acceptance criteria using Given <precondition>, When <action>, Then <expected result>.**:
   - Draft acceptance criteria using Given <precondition>, When <action>, Then <expected result>.

3. **Enumerate edge cases**:
   - Enumerate edge cases: validation errors, empty states, and unauthorized access scenarios.

4. **Review stories with QA engineers to ensure criteria map directly to automated test suites.**:
   - Review stories with QA engineers to ensure criteria map directly to automated test suites.

## Recommended Tools & Environments
- Agile / Scrum
- Gherkin Syntax
- Jira / Linear
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
