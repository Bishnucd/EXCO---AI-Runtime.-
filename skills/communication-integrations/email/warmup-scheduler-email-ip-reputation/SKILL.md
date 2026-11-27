---
name: warmup-scheduler-email-ip-reputation
description: Schedules automated, progressive email sending volume ramp-ups for newly provisioned sender IPs. Use when establishing high sender reputation on fresh dedicated mail servers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://sendgrid.com/en-us/blog/how-to-warm-up-an-ip-address"
---
# Warmup Scheduler Email Ip Reputation

## Overview
Blasting thousands of emails from a new IP triggers immediate spam blocks from Gmail and Yahoo. A warmup scheduler ramps volume up exponentially over 4-6 weeks to establish trusted sender history.

## Operational Workflow

1. **Define day-by-day sending caps starting at 50 emails/day and doubling every 3-4 days.**:
   - Define day-by-day sending caps starting at 50 emails/day and doubling every 3-4 days.

2. **Prioritize highest-engagement recipients (active users who consistently open emails) during early days.**:
   - Prioritize highest-engagement recipients (active users who consistently open emails) during early days.

3. **Distribute hourly sending evenly throughout the day to avoid sudden traffic spikes.**:
   - Distribute hourly sending evenly throughout the day to avoid sudden traffic spikes.

4. **Throttle or pause volume expansion if bounce rates exceed 2% or spam complaints exceed 0.08%.**:
   - Throttle or pause volume expansion if bounce rates exceed 2% or spam complaints exceed 0.08%.

## Recommended Tools & Environments
- Email Deliverability
- IP Warmup
- Algorithms
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
