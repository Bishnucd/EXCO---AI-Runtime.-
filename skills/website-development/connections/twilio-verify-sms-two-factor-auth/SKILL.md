---
name: twilio-verify-sms-two-factor-auth
description: Implements SMS-based two-factor authentication and phone verification using the Twilio Verify API. Use when securing user accounts and verifying genuine telephone numbers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.twilio.com/docs/verify/api"
---
# Twilio Verify Sms Two Factor Auth

## Overview
Managing one-time passcodes (OTP), token generation, rate limits, and carrier deliverability manually is difficult. Twilio Verify handles OTP lifecycle, retries, and validation through a single API.

## Operational Workflow

1. **Trigger verification code dispatch**:
   - Trigger verification code dispatch: client.verify.v2.services(sid).verifications.create({ to: phone, channel: "sms" }).

2. **Display verification code input modal to user with 10-minute validity timer.**:
   - Display verification code input modal to user with 10-minute validity timer.

3. **Verify user-submitted code**:
   - Verify user-submitted code: client.verify.v2.services(sid).verificationChecks.create({ to: phone, code: userCode }).

4. **If check status is "approved", activate user account or grant authenticated 2FA session token.**:
   - If check status is "approved", activate user account or grant authenticated 2FA session token.

## Recommended Tools & Environments
- Twilio Verify API
- SMS 2FA
- Phone Verification
- Authentication

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
