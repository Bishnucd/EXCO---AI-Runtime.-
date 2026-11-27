---
name: in-app-purchase-storekit2-billing
description: Implements native subscriptions and consumable in-app purchases using Apple StoreKit 2 and Google Play Billing. Use when monetizing mobile apps with native subscriptions and purchases.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.apple.com/documentation/storekit/in-app_purchase"
---
# In App Purchase Storekit2 Billing

## Overview
Mobile platforms require strict compliance with native app store billing APIs. Modern implementations use StoreKit 2 and Play Billing with server-side JWS cryptographic receipt validation.

## Operational Workflow

1. **Fetch available product identifiers and localized pricing metadata from App Store / Play Store.**:
   - Fetch available product identifiers and localized pricing metadata from App Store / Play Store.

2. **Present paywall views with required Apple subscription disclosures and restore buttons.**:
   - Present paywall views with required Apple subscription disclosures and restore buttons.

3. **Initiate native purchase sheets and handle asynchronous transaction states.**:
   - Initiate native purchase sheets and handle asynchronous transaction states.

4. **Validate signed JWS transaction tokens on backend servers before granting entitlement access.**:
   - Validate signed JWS transaction tokens on backend servers before granting entitlement access.

## Recommended Tools & Environments
- StoreKit 2 (iOS)
- Google Play Billing (Android)
- RevenueCat
- Swift / Kotlin

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
