---
name: push-notifications-apns-fcm-setup
description: Implements push notification token registration, background handlers, and APNs/FCM payload routing. Use when sending transactional and marketing notifications to iOS and Android apps.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://firebase.google.com/docs/cloud-messaging"
---
# Push Notifications Apns Fcm Setup

## Overview
Mobile push notifications require negotiating OS permissions, uploading APNs auth keys (.p8) to delivery gateways, storing device tokens, and handling background payload triggers.

## Operational Workflow

1. **Request runtime notification permissions in iOS and Android application code.**:
   - Request runtime notification permissions in iOS and Android application code.

2. **Register device token with push gateway (FCM / APNs) and transmit token to backend database.**:
   - Register device token with push gateway (FCM / APNs) and transmit token to backend database.

3. **Configure HTTP v1 API payload structure with alert titles, sound triggers, and custom data keys.**:
   - Configure HTTP v1 API payload structure with alert titles, sound triggers, and custom data keys.

4. **Handle background notification reception and foreground banner display logic.**:
   - Handle background notification reception and foreground banner display logic.

## Recommended Tools & Environments
- Firebase Cloud Messaging (FCM)
- Apple APNs
- HTTP v1 API
- Mobile SDKs

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
