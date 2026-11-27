---
name: license-compliance-foss-audit
description: Audits open-source software licenses across application dependencies to prevent viral copyleft GPL contamination. Use when verifying intellectual property and legal license compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://spdx.org/licenses/"
---
# License Compliance Foss Audit

## Overview
Accidental inclusion of AGPL or strong copyleft libraries can legally obligate commercial software to open its source code. Automated audits flag incompatible or non-permissive licenses.

## Operational Workflow

1. **Extract SPDX license identifiers from all direct and transitive dependency packages.**:
   - Extract SPDX license identifiers from all direct and transitive dependency packages.

2. **Categorize detected licenses into Allowed (MIT, Apache-2.0, BSD), Warning, and Prohibited (AGPL-3.0, GPL-3.0).**:
   - Categorize detected licenses into Allowed (MIT, Apache-2.0, BSD), Warning, and Prohibited (AGPL-3.0, GPL-3.0).

3. **Generate audit reports flagging packages with missing or ambiguous license declarations.**:
   - Generate audit reports flagging packages with missing or ambiguous license declarations.

4. **Fail CI builds when prohibited copyleft licenses are introduced.**:
   - Fail CI builds when prohibited copyleft licenses are introduced.

## Recommended Tools & Environments
- license-checker
- Python / Node.js
- SPDX
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
