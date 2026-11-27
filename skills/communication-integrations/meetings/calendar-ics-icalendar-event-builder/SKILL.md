---
name: calendar-ics-icalendar-event-builder
description: Generates standardized iCalendar (.ics) event files with RRULE recurring schedules and alarms per RFC 5545. Use when generating downloadable calendar invite files for emails and websites.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc5545"
---
# Calendar Ics Icalendar Event Builder

## Overview
Emailing calendar invites requires formatting valid RFC 5545 VCALENDAR objects with UTC timestamps, unique UID hashes, recurrence rules (RRULE), and VALARM reminder blocks.

## Operational Workflow

1. **Initialize VCALENDAR container with version**:
   - Initialize VCALENDAR container with version: 2.0 and prodid.

2. **Create VEVENT specifying DTSTART, DTEND, SUMMARY, DESCRIPTION, and LOCATION.**:
   - Create VEVENT specifying DTSTART, DTEND, SUMMARY, DESCRIPTION, and LOCATION.

3. **Configure RRULE for recurring meetings (e.g. FREQ=WEEKLY;BYDAY=MO,WE).**:
   - Configure RRULE for recurring meetings (e.g. FREQ=WEEKLY;BYDAY=MO,WE).

4. **Attach VALARM trigger (-PT15M) and export clean .ics file with text/calendar MIME type.**:
   - Attach VALARM trigger (-PT15M) and export clean .ics file with text/calendar MIME type.

## Recommended Tools & Environments
- iCalendar (RFC 5545)
- ical-generator / icalendar
- Python / Node.js
- MIME

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
