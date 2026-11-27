---
name: sop-writing
description: Creates clear, maintainable Standard Operating Procedures (SOPs) from raw process knowledge, with version control, review cycles, and distribution readiness. Use when documenting a recurring process, onboarding someone to a task, preparing for an audit, or replacing tribal knowledge with a written procedure.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
  source: originally authored for Community List
---

# SOP Writing Skill

## Purpose
Transform informal "how we do things" into documented, auditable procedures that teams can follow consistently and improve over time.

## Scope
Covers SOP creation from interview through publication and maintenance. Does not cover: process design (assumes process exists), tool-specific formatting beyond Markdown, or organizational change management.

## Operational Instructions
1. **Discovery** — Interview 1-3 SMEs who perform the process. Capture: trigger, steps, decision points, tools, handoffs, exceptions, metrics.
2. **Structure** — Organize into standard sections: Purpose, Scope, Prerequisites, Roles & Responsibilities, Procedure (numbered steps), Decision Trees, References, Revision History.
3. **Draft** — Write in active voice, present tense. One action per step. Include screenshots/diagrams for complex steps. Mark conditional steps with [IF/THEN].
4. **Review** — Route to: (a) SME for accuracy, (b) stakeholder for completeness, (c) compliance if regulated. Track comments in version control.
5. **Approve** — Obtain documented approval (PR approval, signature, or email). Record approver, date, version.
6. **Publish** — Commit to version-controlled repo (Git). Deploy to accessible location (Confluence, Notion, GitBook, static site). Set canonical URL.
7. **Maintain** — Schedule quarterly review. Assign owner. Log changes in Revision History. Archive superseded versions.

## Rules
- Every SOP must have a single accountable owner.
- Steps must be testable: a new hire should execute without guessing.
- Decision points must have explicit criteria, not "use judgment."
- Version format: MAJOR.MINOR (major = structural change, minor = clarification).
- Never delete old versions; archive with deprecation notice.

## Execution Workflow
1. Receive SOP request (topic, audience, urgency)
2. Identify and schedule SME interviews
3. Conduct interviews, record/transcribe
4. Draft SOP in Markdown using template
5. Self-review for completeness against template
6. Submit for multi-party review (SME + stakeholder + compliance)
7. Incorporate feedback, version bump
8. Obtain approval, publish
9. Notify affected teams, link in onboarding docs
10. Set quarterly review reminder

## Constraints
- SME availability often limits timeline (plan 2-4 weeks)
- Regulated environments may require specific formats (FDA, ISO, SOC2)
- Tool choice may be constrained by org policy
- Cultural resistance to documentation requires change management

## Expected Outputs
- `sop-<topic>.md` — Markdown source file
- `sop-<topic>-v<major>.<minor>.pdf` — Optional PDF for printing/signatures
- Revision History section updated
- Review/approval records (PR, email, or signature)

## Error Handling
- **SME unavailable:** Escalate to manager, document knowledge gaps, ship "DRAFT - NEEDS SME REVIEW"
- **Conflicting accounts:** Document both, flag for process owner decision, don't arbitrate
- **Process changes during drafting:** Freeze scope for v1.0, log changes for v1.1
- **Review stall:** Auto-escalate after 5 business days, ship with "PENDING REVIEW" banner

## Examples
**Trigger:** "We need an SOP for production incident response."
**Output:** `sop-incident-response.md` with sections for SEV levels, paging, war room, comms, rollback, postmortem.

**Trigger:** "Document the release checklist."
**Output:** `sop-release-checklist.md` with pre-deploy, deploy, post-deploy, rollback steps and approval gates.