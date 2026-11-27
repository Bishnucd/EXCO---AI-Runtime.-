---
name: allure-test-reporting-framework-adapter
description: Generates rich interactive test reports with execution steps, screenshots, and failure traces using Allure Report. Use when standardizing test reporting across heterogeneous test frameworks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://allurereport.org/docs/"
---
# Allure Test Reporting Framework Adapter

## Overview
Allure Report provides a unified, beautiful HTML reporting dashboard that aggregates results from Pytest, Jest, Playwright, and JUnit, detailing execution history, flakiness, and attachments.

## Operational Workflow

1. **Install Allure adapter for target test runner (e.g., allure-playwright or allure-pytest).**:
   - Install Allure adapter for target test runner (e.g., allure-playwright or allure-pytest).

2. **Annotate test cases with metadata**:
   - Annotate test cases with metadata: @allure.severity, @allure.feature, @allure.story, and steps.

3. **Attach failed screenshot images and network request logs to test context automatically on failure.**:
   - Attach failed screenshot images and network request logs to test context automatically on failure.

4. **Generate and publish static Allure HTML report artifact in CI deployment pipeline.**:
   - Generate and publish static Allure HTML report artifact in CI deployment pipeline.

## Recommended Tools & Environments
- Allure Report
- Test Analytics
- CI/CD Reporting
- Heterogeneous Frameworks

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
