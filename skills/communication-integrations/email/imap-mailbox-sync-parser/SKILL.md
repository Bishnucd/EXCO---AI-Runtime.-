---
name: imap-mailbox-sync-parser
description: Parses incoming email streams via IMAP IDLE connections and extracts message bodies, headers, and attachments. Use when building automated email ingestion, ticket creation, or CRM synchronization.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://datatracker.ietf.org/doc/html/rfc3501"
---
# Imap Mailbox Sync Parser

## Overview
Automated email ingestion requires persistent IMAP connections, real-time push notifications via IMAP IDLE, MIME multipart boundary parsing, and safe attachment extraction.

## Operational Workflow

1. **Establish TLS-encrypted IMAP connection with keep-alive heartbeats and IDLE listening.**:
   - Establish TLS-encrypted IMAP connection with keep-alive heartbeats and IDLE listening.

2. **Fetch unprocessed message UIDs upon receiving mailbox status notifications.**:
   - Fetch unprocessed message UIDs upon receiving mailbox status notifications.

3. **Stream and parse raw RFC 2822 MIME streams into structured sender, subject, and body fields.**:
   - Stream and parse raw RFC 2822 MIME streams into structured sender, subject, and body fields.

4. **Extract, scan, and store file attachments safely in designated object storage.**:
   - Extract, scan, and store file attachments safely in designated object storage.

## Recommended Tools & Environments
- Node.js / Python
- IMAP Protocol
- Mailparser
- MIME

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
