---
name: bounce-handling-automated-suppression-list
description: Processes hard and soft email bounce webhooks to maintain real-time recipient suppression lists. Use when protecting domain reputation by preventing deliveries to invalid addresses.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc3463"
---
# Bounce Handling Automated Suppression List

## Overview
Repeatedly sending emails to invalid addresses destroys domain sender reputation. Processing RFC 3463 bounce status codes (5.1.1 unknown user) automatically suppresses invalid recipients.

## Operational Workflow

1. **Ingest bounce webhook events from delivery provider (SendGrid, SES, Resend).**:
   - Ingest bounce webhook events from delivery provider (SendGrid, SES, Resend).

2. **Parse status codes**:
   - Parse status codes: categorize into Hard Bounce (permanent failure) vs Soft Bounce (mailbox full).

3. **Add hard bounce email addresses immediately to permanent recipient suppression tables.**:
   - Add hard bounce email addresses immediately to permanent recipient suppression tables.

4. **Filter all outbound mail queues against the suppression list before dispatching SMTP calls.**:
   - Filter all outbound mail queues against the suppression list before dispatching SMTP calls.

## Recommended Tools & Environments
- RFC 3463 Enhanced Mail Status
- Webhooks
- Redis / SQL
- Deliverability

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
