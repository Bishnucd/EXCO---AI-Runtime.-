---
name: vitest-in-source-unit-testing
description: Runs lightning-fast unit tests and co-located in-source component tests using Vitest and Vite. Use when building modern TypeScript libraries and frontend applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://vitest.dev/guide/in-source.html"
---
# Vitest In Source Unit Testing

## Overview
Vitest shares Vite transformation pipelines and HMR, executing TypeScript tests in milliseconds. In-source testing embeds unit tests directly inside implementation files, stripped during build.

## Operational Workflow

1. **Configure vitest.config.ts with includeSource**:
   - Configure vitest.config.ts with includeSource: ["src/**/*.{js,ts}"].

2. **Embed tests inside production file using if (import.meta.vitest) { const { it, expect } = import.meta.vitest; ... }.**:
   - Embed tests inside production file using if (import.meta.vitest) { const { it, expect } = import.meta.vitest; ... }.

3. **Execute npx vitest run for instantaneous test results using native ESM without transpilation overhead.**:
   - Execute npx vitest run for instantaneous test results using native ESM without transpilation overhead.

4. **Verify that production Vite bundle strips test blocks completely during production compilation.**:
   - Verify that production Vite bundle strips test blocks completely during production compilation.

## Recommended Tools & Environments
- Vitest
- Vite
- In-Source Testing
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
