---
name: testcafe-browser-runner-zero-webdriver
description: Executes automated end-to-end web browser tests without WebDriver binaries using TestCafe. Use when configuring fast, zero-dependency browser testing in lightweight CI environments.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://testcafe.io/documentation/402635/getting-started"
---
# Testcafe Browser Runner Zero Webdriver

## Overview
TestCafe communicates directly with browser windows via URL rewriting and client-side proxies, eliminating the need to install or maintain browser-specific WebDriver or ChromeDriver binaries.

## Operational Workflow

1. **Install testcafe npm package and author test fixture in TypeScript.**:
   - Install testcafe npm package and author test fixture in TypeScript.

2. **Define test actions using Selector and t.click(), t.typeText(), and t.expect() assertions.**:
   - Define test actions using Selector and t.click(), t.typeText(), and t.expect() assertions.

3. **Execute tests across multiple browsers**:
   - Execute tests across multiple browsers: npx testcafe chrome,firefox tests/.

4. **Inspect built-in video recordings and screenshot captures on test failure.**:
   - Inspect built-in video recordings and screenshot captures on test failure.

## Recommended Tools & Environments
- TestCafe
- Node.js / TypeScript
- Zero-WebDriver
- Browser Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
