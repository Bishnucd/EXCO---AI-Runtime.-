---
name: braintrust-eval-logger
description: Logs agent execution spans and runs regression evaluation experiments using Braintrust SDK. Use when tracking agent performance, costs, and output quality across versions.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.braintrust.dev/docs"
---
# Braintrust Eval Logger

## Overview
Braintrust provides end-to-end logging, dataset management, and automated evaluation for AI applications, enabling teams to detect regressions before they reach customers.

## Operational Workflow

1. **Initialize Braintrust logger to wrap agent API client invocations.**:
   - Initialize Braintrust logger to wrap agent API client invocations.

2. **Capture input prompts, tool call arguments, output responses, and latency metrics.**:
   - Capture input prompts, tool call arguments, output responses, and latency metrics.

3. **Execute automated eval experiments against curated golden benchmark datasets.**:
   - Execute automated eval experiments against curated golden benchmark datasets.

4. **Compare experiment metrics side-by-side on the Braintrust web dashboard.**:
   - Compare experiment metrics side-by-side on the Braintrust web dashboard.

## Recommended Tools & Environments
- Braintrust SDK
- TypeScript / Python
- REST
- OpenAI

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
