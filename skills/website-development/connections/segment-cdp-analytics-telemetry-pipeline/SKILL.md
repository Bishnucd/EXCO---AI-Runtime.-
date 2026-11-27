---
name: segment-cdp-analytics-telemetry-pipeline
description: Instruments customer data platform (CDP) telemetry using Segment Analytics.js track and identify calls. Use when routing customer behavioral data to multiple analytics and marketing tools.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/"
---
# Segment Cdp Analytics Telemetry Pipeline

## Overview
Adding separate SDKs for Google Analytics, Mixpanel, Amplitude, and Facebook Pixels slows down page loads. Segment provides a single unified API that routes events to hundreds of destinations.

## Operational Workflow

1. **Load Segment Analytics.js snippet in application header with write key configuration.**:
   - Load Segment Analytics.js snippet in application header with write key configuration.

2. **Call analytics.identify(userId, { name, email, plan }) upon user authentication.**:
   - Call analytics.identify(userId, { name, email, plan }) upon user authentication.

3. **Track core product actions**:
   - Track core product actions: analytics.track("Project Created", { projectId, templateType }).

4. **Configure Segment destination filters and schema validation rules to prevent bad event data.**:
   - Configure Segment destination filters and schema validation rules to prevent bad event data.

## Recommended Tools & Environments
- Segment CDP
- Analytics.js
- Customer Telemetry
- Event Routing

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
