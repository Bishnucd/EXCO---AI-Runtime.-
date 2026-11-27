---
name: lighthouse-ci-automated-performance-gate
description: Enforces Core Web Vitals, performance budgets, and PWA scores in CI/CD using Lighthouse CI (LHCI). Use when preventing performance regressions from degrading search engine rankings.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/GoogleChrome/lighthouse-ci"
---
# Lighthouse Ci Automated Performance Gate

## Overview
Lighthouse CI runs headless browser audits on every pull request, measuring Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and JavaScript bundle budgets against strict thresholds.

## Operational Workflow

1. **Configure .lighthouserc.json specifying target URLs, number of runs (min 3), and assertion rules.**:
   - Configure .lighthouserc.json specifying target URLs, number of runs (min 3), and assertion rules.

2. **Set performance budget assertions (e.g., categories**:
   - Set performance budget assertions (e.g., categories:performance >= 0.90, first-contentful-paint <= 1800).

3. **Execute lhci autorun inside GitHub Actions or GitLab CI runner.**:
   - Execute lhci autorun inside GitHub Actions or GitLab CI runner.

4. **Block pull request merges automatically if a new dependency introduces a performance regression.**:
   - Block pull request merges automatically if a new dependency introduces a performance regression.

## Recommended Tools & Environments
- Lighthouse CI
- Core Web Vitals
- Performance Budgets
- CI/CD Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
