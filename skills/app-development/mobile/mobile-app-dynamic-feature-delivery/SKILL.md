---
name: mobile-app-dynamic-feature-delivery
description: Configures on-demand dynamic feature modules and split APK delivery using Google Play Feature Delivery. Use when reducing initial download size and downloading heavy features on demand.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developer.android.com/guide/playcore/feature-delivery"
---
# Mobile App Dynamic Feature Delivery

## Overview
Giant app download sizes crush conversion rates. Dynamic feature delivery allows apps to split out heavy features (e.g. video editors, AR filters) and download them on-demand after installation.

## Operational Workflow

1. **Configure dynamic feature modules in settings.gradle and app/build.gradle.**:
   - Configure dynamic feature modules in settings.gradle and app/build.gradle.

2. **Define delivery conditions in module manifest (on-demand vs install-time vs country-conditional).**:
   - Define delivery conditions in module manifest (on-demand vs install-time vs country-conditional).

3. **Integrate SplitInstallManager in application code to request and monitor module download progress.**:
   - Integrate SplitInstallManager in application code to request and monitor module download progress.

4. **Load module classes and resources dynamically once split installation finishes.**:
   - Load module classes and resources dynamically once split installation finishes.

## Recommended Tools & Environments
- Play Feature Delivery
- Android Dynamic Modules
- Gradle
- Play Core SDK

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
