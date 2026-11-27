---
name: calendar-availability-conflict-resolver
description: Calculates optimal meeting time slots across multi-participant, multi-timezone calendars via free-busy queries. Use when automating meeting scheduling and calendar coordination.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/calendar/api/v3/reference/freebusy"
---
# Calendar Availability Conflict Resolver

## Overview
Scheduling meetings across distributed teams requires querying free/busy windows, normalizing timezone offsets, respecting working hours, and resolving conflicting reservations.

## Operational Workflow

1. **Query free-busy endpoints for all mandatory and optional attendee calendars.**:
   - Query free-busy endpoints for all mandatory and optional attendee calendars.

2. **Normalize candidate time blocks into UTC while mapping to individual participant working hours.**:
   - Normalize candidate time blocks into UTC while mapping to individual participant working hours.

3. **Score candidate slots based on participant convenience, buffer times, and minimal context switching.**:
   - Score candidate slots based on participant convenience, buffer times, and minimal context switching.

4. **Emit top 3 recommended meeting time slots with calendar reservation links.**:
   - Emit top 3 recommended meeting time slots with calendar reservation links.

## Recommended Tools & Environments
- Google Calendar API
- Microsoft Graph API
- Date-fns / Luxon
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
