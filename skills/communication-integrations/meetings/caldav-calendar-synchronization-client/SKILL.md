---
name: caldav-calendar-synchronization-client
description: Synchronizes calendar events across Apple iCloud, Nextcloud, and Google Calendar using the CalDAV protocol (RFC 4791). Use when building cross-platform calendar synchronization engines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc4791"
---
# Caldav Calendar Synchronization Client

## Overview
Proprietary calendar APIs create vendor lock-in. CalDAV is the open internet standard for calendar synchronization, using WebDAV XML queries (REPORT, PROPFIND) to fetch and mutate events.

## Operational Workflow

1. **Discover CalDAV principal URL and calendar collection home set using PROPFIND.**:
   - Discover CalDAV principal URL and calendar collection home set using PROPFIND.

2. **Execute calendar-query REPORT to fetch events falling within target date ranges.**:
   - Execute calendar-query REPORT to fetch events falling within target date ranges.

3. **Parse returned iCalendar objects and reconcile local database state.**:
   - Parse returned iCalendar objects and reconcile local database state.

4. **Push new events using HTTP PUT passing RFC 5545 iCalendar bodies with ETag caching.**:
   - Push new events using HTTP PUT passing RFC 5545 iCalendar bodies with ETag caching.

## Recommended Tools & Environments
- CalDAV (RFC 4791)
- WebDAV
- caldav-client
- Python / Node.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
