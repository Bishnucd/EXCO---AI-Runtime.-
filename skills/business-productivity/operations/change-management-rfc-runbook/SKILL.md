---
name: change-management-rfc-runbook
description: Structures Request for Change (RFC) documents detailing risk impact, rollback plans, and maintenance windows. Use when proposing and approving production infrastructure changes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://itil-docs.com/blogs/change-management/itil-change-management-process"
---
# Change Management Rfc Runbook

## Overview
Uncontrolled production changes cause over 70% of enterprise outages. An RFC requires engineers to specify exact commands, impact radius, peer reviewers, and verified rollback procedures.

## Operational Workflow

1. **Categorize change type**:
   - Categorize change type: Standard (pre-approved), Normal (CAB review), or Emergency.

2. **Detail proposed technical alterations, target maintenance window, and expected customer impact.**:
   - Detail proposed technical alterations, target maintenance window, and expected customer impact.

3. **Document step-by-step implementation commands alongside an automated verification plan.**:
   - Document step-by-step implementation commands alongside an automated verification plan.

4. **Provide tested, step-by-step rollback procedures to execute if verification health checks fail.**:
   - Provide tested, step-by-step rollback procedures to execute if verification health checks fail.

## Recommended Tools & Environments
- ITIL v4
- Change Advisory Board (CAB)
- Runbooks
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
