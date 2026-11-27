---
name: proposal-scoping
description: Turns a vague client request into a scoped proposal with explicit deliverables, exclusions, assumptions, acceptance criteria, timeline, and price basis, and flags the ambiguity that would otherwise become unpaid work. Use when writing a statement of work, quoting a project, or rescoping one that is going over.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Proposal Scoping

Scope creep is not a client failing; it is a proposal that did not define the edges.

## When to use

- Writing a proposal, quote, or statement of work.
- A project is going over budget and needs rescoping.
- Comparing two client requests that sound similar but are not.
- Converting a discovery call into a fixed-scope engagement.

## Workflow

### 1. Extract the actual request

Write the client's request in one sentence, then list what they said they want, what they implied,
and what they did not mention but will expect. The third list is where the losses are.

```
Said:      "a new website"
Implied:   content migration, SEO preservation, analytics
Unsaid:    who writes copy, image licensing, training, post-launch support
```

### 2. Define deliverables as verifiable objects

A deliverable is a noun with a test, not an activity.

| Weak | Strong |
|------|--------|
| "Design work" | "5 page designs in Figma, desktop and mobile, 2 revision rounds" |
| "SEO" | "Redirect map for the 40 highest-traffic URLs, verified with a crawl" |
| "Support" | "Email support, 2 business days, for 30 days after launch" |

Every deliverable needs: quantity, format, and a completion test.

### 3. Write the exclusions explicitly

This section protects both parties. List what is not included:

- Content writing and copy editing.
- Photography and image licensing.
- Third-party licence and hosting fees.
- Migration of more than N pages or items.
- Integrations not named in the deliverables.
- Training beyond one session.
- Support beyond the stated window.

Exclusions are not hostile; they are the definition of the boundary.

### 4. State assumptions as testable conditions

An assumption is something you are relying on that, if false, changes the price or timeline.

```
Assumption: the client provides final copy within 5 business days of design sign-off.
If false: timeline extends by the delay, and a second review round is billed at £X/hour.
```

### 5. Build the timeline from dependencies

List phases with durations and the dependency that gates each one. Include client-side
dependencies (feedback, access, content) with their own due dates. A timeline without client
obligations is a promise you cannot keep.

### 6. Set the price basis

Choose and state one:

| Basis | Use when | Risk |
|-------|----------|------|
| Fixed price | Scope is genuinely fixed | You absorb underestimation |
| Time and materials with a cap | Scope is uncertain | Client bears overrun within the cap |
| Retainer | Ongoing work | Scope must be re-agreed each period |

State what triggers a change order: a new deliverable, a change to an accepted deliverable after
sign-off, or an assumption proving false.

### 7. Write acceptance criteria

For each deliverable, how both sides will agree it is done. Tie payment milestones to acceptance,
not to activity.

### 8. Review for the three failure modes

1. **Undefined edge** — a phrase a reasonable person could interpret two ways ("modern design").
2. **Unpriced dependency** — a third-party cost not passed through.
3. **Silent obligation** — "and anything else needed to make it work".

## Rules

- Never promise a date without listing the client dependencies that gate it.
- Never use an adjective as a deliverable ("professional", "modern", "robust") without a test.
- Never omit exclusions to appear accommodating; that is how the loss happens.
- Never state a price without the basis and the change-order trigger.
- Do not include confidential client information in a reusable template.

## Output format

```markdown
# Proposal: <project>

## Objective
<one sentence>

## Deliverables
| # | Deliverable | Quantity / format | Completion test |

## Exclusions
- <item>

## Assumptions
| # | Assumption | If false |

## Timeline
| Phase | Duration | Starts when | Client dependency |

## Price
<basis, amount, payment milestones tied to acceptance>

## Change orders
<trigger and process>

## Acceptance
<how each deliverable is signed off>
```

## Error handling

| Condition | Action |
|-----------|--------|
| Client refuses to define scope | Propose a paid discovery phase with its own deliverable |
| Request is genuinely open-ended | Use time and materials with a cap; do not fix-price it |
| Deadline is fixed and scope is not | State the scope that fits the deadline, and price the rest separately |
| Existing project is over budget | Produce a rescope with the change-order history, not a discount |

## Example

**Input:** "We need a new marketing site, soon, with SEO."
**Output:** 6 deliverables with tests, 9 exclusions, 4 assumptions with consequences, a timeline
gated on copy delivery, a fixed price with 3 milestones, and a note that "soon" required a
definition before any date was offered.
