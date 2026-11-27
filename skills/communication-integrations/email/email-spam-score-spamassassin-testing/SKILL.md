---
name: email-spam-score-spamassassin-testing
description: Scans outbound email templates and headers against Apache SpamAssassin scoring rules. Use when eliminating spam filter triggers before launching customer campaigns.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://spamassassin.apache.org/"
---
# Email Spam Score Spamassassin Testing

## Overview
Trigger words, poor HTML-to-text ratios, or broken MIME boundaries land emails in junk folders. Scoring emails against SpamAssassin rules flags problem areas before messages are sent.

## Operational Workflow

1. **Compile complete RFC 2822 email payload including all headers and MIME multipart boundaries.**:
   - Compile complete RFC 2822 email payload including all headers and MIME multipart boundaries.

2. **Pass payload through spamassassin -t check runner to compute cumulative score.**:
   - Pass payload through spamassassin -t check runner to compute cumulative score.

3. **Inspect detailed hit rules (e.g. HTML_IMAGE_RATIO_SMALL, MISSING_MID, SPF_PASS).**:
   - Inspect detailed hit rules (e.g. HTML_IMAGE_RATIO_SMALL, MISSING_MID, SPF_PASS).

4. **Refactor template copy and markup until cumulative spam score falls well below threshold (< 2.0).**:
   - Refactor template copy and markup until cumulative spam score falls well below threshold (< 2.0).

## Recommended Tools & Environments
- Apache SpamAssassin
- Spam Score Rules
- MIME
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
