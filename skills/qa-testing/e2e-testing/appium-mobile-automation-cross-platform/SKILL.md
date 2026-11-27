---
name: appium-mobile-automation-cross-platform
description: Automates native and hybrid iOS and Android mobile app workflows using Appium 2.x and WebDriverIO. Use when executing automated mobile regressions across physical devices and emulators.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://appium.io/docs/en/latest/"
---
# Appium Mobile Automation Cross Platform

## Overview
Appium bridges standard W3C WebDriver protocols to native iOS XCUITest and Android UiAutomator2 drivers, enabling cross-platform mobile automated test execution with unified test scripts.

## Operational Workflow

1. **Install Appium 2.0 server with xcuitest and uiautomator2 platform drivers.**:
   - Install Appium 2.0 server with xcuitest and uiautomator2 platform drivers.

2. **Configure desired capabilities specifying deviceName, platformVersion, and application .ipa / .apk path.**:
   - Configure desired capabilities specifying deviceName, platformVersion, and application .ipa / .apk path.

3. **Locate native elements using accessibility identifiers (~accessibilityId) for cross-platform portability.**:
   - Locate native elements using accessibility identifiers (~accessibilityId) for cross-platform portability.

4. **Execute gesture interactions (swipes, taps, pinches) and assert expected native screen transitions.**:
   - Execute gesture interactions (swipes, taps, pinches) and assert expected native screen transitions.

## Recommended Tools & Environments
- Appium 2.x
- WebDriverIO
- iOS / Android Automation
- Mobile QA

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
