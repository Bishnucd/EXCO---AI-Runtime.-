---
name: newman-postman-cli-collection-runner
description: Executes automated Postman API collections and assertion test scripts from the command line using Newman. Use when running Postman API integration suites in CI/CD pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/"
---
# Newman Postman Cli Collection Runner

## Overview
Newman allows teams to run Postman collections in headless CI environments, passing dynamic environment files, checking pm.expect assertions, and exporting JUnit XML test reports.

## Operational Workflow

1. **Export Postman collection JSON and environment variable JSON from Postman workspace.**:
   - Export Postman collection JSON and environment variable JSON from Postman workspace.

2. **Execute newman run collection.json -e env.json --reporters cli,junit --reporter-junit-export report.xml.**:
   - Execute newman run collection.json -e env.json --reporters cli,junit --reporter-junit-export report.xml.

3. **Verify execution of pre-request scripts, token authentications, and response status assertions.**:
   - Verify execution of pre-request scripts, token authentications, and response status assertions.

4. **Publish JUnit XML test execution reports to CI dashboard to track API regression trends.**:
   - Publish JUnit XML test execution reports to CI dashboard to track API regression trends.

## Recommended Tools & Environments
- Newman
- Postman Collections
- CLI Runner
- API Automation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
