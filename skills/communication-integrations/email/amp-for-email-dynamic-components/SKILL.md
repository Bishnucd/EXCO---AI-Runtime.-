---
name: amp-for-email-dynamic-components
description: Authors interactive AMP for Email components (carousels, live forms, real-time accordions). Use when building dynamic interactive emails that allow users to take action inside Gmail.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://amp.dev/documentation/guides-and-tutorials/learn/email-spec/amp-email-format/"
---
# Amp For Email Dynamic Components

## Overview
Standard emails are static snapshots. AMP for Email allows interactive form submissions (e.g. submitting a survey or approving an expense) directly inside the email without opening web browsers.

## Operational Workflow

1. **Structure email with multipart/alternative containing text/plain, text/html, and text/x-amp-html.**:
   - Structure email with multipart/alternative containing text/plain, text/html, and text/x-amp-html.

2. **Embed interactive AMP components (<amp-form>, <amp-carousel>, <amp-list>).**:
   - Embed interactive AMP components (<amp-form>, <amp-carousel>, <amp-list>).

3. **Configure authenticated CORS endpoints handling real-time data fetching and POST submissions.**:
   - Configure authenticated CORS endpoints handling real-time data fetching and POST submissions.

4. **Validate email structure using the official AMP Email Validator before transmission.**:
   - Validate email structure using the official AMP Email Validator before transmission.

## Recommended Tools & Environments
- AMP for Email
- HTML
- REST API
- Gmail / Yahoo

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
