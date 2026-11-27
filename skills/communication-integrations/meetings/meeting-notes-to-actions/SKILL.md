---
name: meeting-notes-to-actions
description: Converts a meeting transcript or rough notes into a decision log and an owned action list, separating what was decided from what was discussed and flagging anything that only sounds like agreement. Use when summarising a meeting, following up after a call, or turning a transcript into tasks.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Meeting Notes to Actions

A meeting produces three things worth keeping: decisions, actions, and open questions. Everything
else is transcript.

## When to use

- Summarising a meeting from a transcript or notes.
- Producing a follow-up with owners and dates.
- A decision needs a written record.
- A meeting ended with "so we're agreed" and nobody is sure what was agreed.

## Workflow

### 1. Separate the three outputs

Read the whole transcript before writing anything. Then classify every substantive passage:

| Class | Test | Output |
|-------|------|--------|
| Decision | Someone with authority stated a choice, and no one objected | Decision log |
| Action | A specific person accepted a specific task | Action list |
| Open question | Raised, not resolved | Open questions |
| Context | Background, opinions, exploration | Omit, unless it explains a decision |

Discussion is not a decision. "We should probably..." is not a decision. "I'll look into it" is
an action only if a person and an outcome are identifiable.

### 2. Record decisions with their evidence

Each decision needs:

- **What** was decided, in one sentence.
- **Who** decided (the person with authority, not the loudest).
- **When** in the meeting (timestamp or section).
- **Why**, if a reason was stated. If not, say "reason not recorded".
- **Alternatives considered**, only if they were actually discussed.

If you cannot name who decided, it is an open question, not a decision.

### 3. Write actions so they are executable

Format: `Owner — action — due date — done-when`.

```
Priya — draft the migration plan for the billing tables — Fri 2026-11-27 —
  a document with the five deploy steps and a rollback per step.
```

Rules:
- One owner. Shared ownership means no owner; name a lead.
- A verb, not a topic ("draft", not "migration plan").
- A due date, or an explicit "no date agreed".
- A completion test. "Investigate X" is not complete-able; "report findings on X" is.
- If the owner did not explicitly accept, mark it `unconfirmed` and list it for follow-up.

### 4. Flag soft agreement

Call out the phrases that are not commitments:

- "Sounds good" / "makes sense" — acknowledgement, not approval.
- "I think we can" — intent, not commitment.
- "Let's circle back" — deferred, not decided.
- Silence after a proposal — not consent unless the meeting explicitly used silence-as-consent.

List these as "apparent but unconfirmed agreement" so the follow-up can close them.

### 5. Preserve dissent

If someone disagreed, record it with their name and reason. A decision log that hides dissent is
worse than none, because the disagreement resurfaces later without context.

### 6. Keep it short

Target: decisions ≤ 5 lines each, actions one line each, open questions one line each. The
transcript is the appendix, not the output.

## Rules

- Never attribute a decision to someone who did not make it.
- Never invent a due date. "No date agreed" is a valid and useful entry.
- Never convert a suggestion into an action without an owner.
- Never summarise away a dissent or a risk that was raised.
- Do not include personal or sensitive remarks that are irrelevant to the outcome.
- Do not include side conversations that had no decision or action.

## Output format

```markdown
# <Meeting> — <date>

**Attendees:** <names>
**Duration:** <minutes>

## Decisions
| # | Decision | Decided by | Evidence |
|---|----------|------------|----------|

## Actions
| # | Owner | Action | Due | Done when | Status |
|---|-------|--------|-----|-----------|--------|

## Open questions
- <question> — raised by <name>, needs <person> to resolve

## Apparent but unconfirmed agreement
- "<quote>" — treated as acknowledgement; confirm with <name>

## Dissent and risks recorded
- <name> disagreed with <decision> because <reason>

## Not recorded
- <topic discussed with no outcome>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Transcript is partial or low quality | Mark gaps explicitly; do not fill from assumption |
| Speaker labels are missing | Use timestamps and quote the text; ask for the attendee list |
| A decision is implied but never stated | Put it in open questions, not decisions |
| Multiple conflicting decisions on one topic | Record both with timestamps and flag the conflict |
| Sensitive HR or legal content | Summarise at the level of "an HR matter was raised"; do not transcribe detail |

## Example

**Input:** 48-minute transcript, six attendees.
**Output:** 3 decisions with named deciders, 7 actions with owners and completion tests, 2 open
questions, and one "sounds good" flagged as unconfirmed rather than counted as approval.
