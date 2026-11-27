---
name: postmark-inbound-email-webhook-parser
description: Parses incoming MIME email messages, attachments, and headers using Postmark inbound webhooks. Use when converting inbound emails into customer support tickets and app replies.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://postmarkapp.com/developer/user-guide/inbound"
---
# Postmark Inbound Email Webhook Parser

## Overview
Parsing raw SMTP MIME emails is complex. Postmark Inbound receives incoming emails, parses sender, subject, text, HTML, and base64 attachments, and POSTs structured JSON payloads to your API.

## Operational Workflow

1. **Configure custom MX record pointing email domain (e.g., in.example.com) to Postmark inbound servers.**:
   - Configure custom MX record pointing email domain (e.g., in.example.com) to Postmark inbound servers.

2. **Configure webhook URL in Postmark server settings to receive inbound JSON payloads.**:
   - Configure webhook URL in Postmark server settings to receive inbound JSON payloads.

3. **Parse From, Subject, StrippedTextReply, and Attachments array in webhook handler.**:
   - Parse From, Subject, StrippedTextReply, and Attachments array in webhook handler.

4. **Match incoming email address to existing user/ticket ID and append message to conversation thread.**:
   - Match incoming email address to existing user/ticket ID and append message to conversation thread.

## Recommended Tools & Environments
- Postmark
- Inbound Email Parsing
- Webhooks
- MIME Processing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
