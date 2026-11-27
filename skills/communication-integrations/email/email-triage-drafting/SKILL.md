---
name: email-triage-drafting
description: Triages an inbox by urgency and required action, then drafts replies that answer the actual question in the sender's terms, with explicit commitments and no invented facts. Use when clearing a backlog, drafting a difficult reply, or converting a thread into a decision.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Email Triage and Drafting

Two jobs: decide what needs you, and say the thing clearly in one pass.

## When to use

- A backlog needs ordering before replying.
- Drafting a reply to a complex or sensitive thread.
- Converting a long thread into a decision or a single action.
- Declining, escalating, or chasing without damaging the relationship.

## Workflow

### 1. Triage by required action, not by sender

Classify each message:

| Bucket | Definition | Handling |
|--------|------------|----------|
| `decide` | A decision is blocked on you | Answer first |
| `act` | A task is assigned to you | Create the task, reply only if needed |
| `reply` | A response is expected but nothing is blocked | Batch later |
| `read` | Informational | Archive after reading |
| `wait` | You are waiting on someone else | Set a follow-up date |
| `drop` | No action, no value | Archive |

Do not use urgency language from the sender ("URGENT!!!") as the sort key. Use: is a person or
project blocked, and for how long.

### 2. Extract the ask

For each message in the `decide`/`reply` buckets, write one line: "They want X by Y." If you
cannot, the message needs a clarifying reply, not an answer.

Watch for:
- A question buried in paragraph four.
- Several asks in one message; answer each explicitly.
- An implied ask ("let me know if that works") that is really a request for approval.

### 3. Draft with a fixed shape

For a reply that answers something:

```
1. The answer, in the first sentence.
2. The reason or the one caveat that matters.
3. What happens next, with a date or an owner.
4. A question only if genuinely needed.
```

For a reply that cannot answer:

```
1. What you can confirm.
2. What you cannot, and why.
3. What you need, and by when.
```

For a decline:

```
1. The decision, plainly.
2. The reason, once, without over-explaining.
3. An alternative if one exists.
```

### 4. Match the sender's register

- Mirror formality, not vocabulary. Do not become more formal than the thread.
- Reply in the sender's language if you can do so accurately; otherwise say you are replying in
  English.
- Keep the thread's terminology; renaming things creates confusion.
- If the sender is upset, acknowledge the specific problem before explaining anything.

### 5. Control commitments

Every promise in a draft must be one you can keep:

- Dates: only state one if it is real. Otherwise: "by end of next week, and I will confirm
  Thursday."
- Scope: say what is included, not only what is not.
- Ownership: name who does it.

### 6. Check before sending

- Every question in the original is answered or explicitly deferred.
- No invented fact, number, date, or attachment.
- No accidental commitment (check for "we will", "I'll", "by Friday").
- Recipients correct; reply-all justified.
- Attachments actually attached.
- Sensitive content not in a forwarded chain.

## Rules

- Never invent a policy, price, date, or prior agreement.
- Never send on the user's behalf without explicit approval; draft, do not dispatch.
- Never use a guilt or urgency framing that the situation does not support.
- Never bury a "no" after three paragraphs of context.
- Do not include internal-only commentary in a draft that may be forwarded.
- Do not reply-all to a large list for a two-person decision.

## Output format

```markdown
## Triage
| # | From | Ask | Bucket | Due | Blocking? |

## Drafts
### To: <recipient> — re: <subject>
<draft>

Commitments made: <list, or "none">
Open questions for you: <list>
```

## Error handling

| Condition | Action |
|-----------|--------|
| The ask is ambiguous | Draft a clarifying question instead of an answer |
| The thread contradicts itself | Quote both statements and ask which is current |
| A reply requires data you do not have | State what is needed; do not estimate |
| The message is hostile | Draft a neutral, short reply; do not mirror the tone |
| Legal or contractual content | Flag it for human review before sending |

## Example

**Input:** 23 unread messages, three threads needing a decision.
**Output:** a triage table with 2 `decide`, 5 `act`, 4 `reply`, 9 `read`, 3 `wait`; three drafts;
and a note that one draft commits to a date the user has not confirmed.
