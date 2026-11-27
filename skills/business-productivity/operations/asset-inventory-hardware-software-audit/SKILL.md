---
name: asset-inventory-hardware-software-audit
description: Constructs automated IT asset inventory audits across physical hardware, cloud instances, and software licenses. Use when maintaining CIS Control 1 & 2 asset management compliance.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.cisecurity.org/controls/cis-controls-list"
---
# Asset Inventory Hardware Software Audit

## Overview
You cannot secure what you do not know exists. CIS Controls 1 & 2 mandate maintaining actively updated inventories of all enterprise hardware devices and authorized software packages.

## Operational Workflow

1. **Discover active enterprise assets across network scanners, cloud provider APIs, and MDM agents.**:
   - Discover active enterprise assets across network scanners, cloud provider APIs, and MDM agents.

2. **Record hardware details**:
   - Record hardware details: serial number, MAC address, assigned user, OS build, and encryption status.

3. **Audit software installations against approved enterprise application whitelists.**:
   - Audit software installations against approved enterprise application whitelists.

4. **Identify unmanaged "shadow IT" devices or unauthorized applications and trigger remediation.**:
   - Identify unmanaged "shadow IT" devices or unauthorized applications and trigger remediation.

## Recommended Tools & Environments
- CIS Controls
- Asset Management
- JSON / CSV
- ITIL

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
