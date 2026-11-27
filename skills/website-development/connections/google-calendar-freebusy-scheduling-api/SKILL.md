---
name: google-calendar-freebusy-scheduling-api
description: Queries Google Calendar API freeBusy intervals to schedule conflict-free client appointments. Use when building automated meeting booking and calendar scheduling workflows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/calendar/api/v3/reference/freebusy/query"
---
# Google Calendar Freebusy Scheduling Api

## Overview
Double-booking clients damages professional reputation. The Google Calendar freeBusy API queries busy intervals across multiple calendar accounts, revealing available scheduling slots.

## Operational Workflow

1. **Authenticate with Google Calendar API using authorized OAuth2 user access token.**:
   - Authenticate with Google Calendar API using authorized OAuth2 user access token.

2. **Submit freebusy.query request with timeMin, timeMax, timeZone, and target calendar ID items.**:
   - Submit freebusy.query request with timeMin, timeMax, timeZone, and target calendar ID items.

3. **Parse returned busy periods array containing start and end ISO timestamp ranges.**:
   - Parse returned busy periods array containing start and end ISO timestamp ranges.

4. **Calculate open availability slots by subtracting busy periods from user designated working hours.**:
   - Calculate open availability slots by subtracting busy periods from user designated working hours.

## Recommended Tools & Environments
- Google Calendar API
- freeBusy Query
- OAuth2
- Scheduling Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
