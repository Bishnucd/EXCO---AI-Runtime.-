---
name: stride-per-component-threat-modeling
description: Decomposes software architecture into Data Flow Diagrams (DFDs) and applies STRIDE threat modeling per element. Use when identifying threats early in the system design phase.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool"
---
# Stride Per Component Threat Modeling

## Overview
STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) analyzes each data flow, process, and data store across architectural trust boundaries.

## Operational Workflow

1. **Draw Level 1 Data Flow Diagram identifying processes, data stores, external entities, and data flows.**:
   - Draw Level 1 Data Flow Diagram identifying processes, data stores, external entities, and data flows.

2. **Mark trust boundaries separating public internet, application tier, and internal database enclaves.**:
   - Mark trust boundaries separating public internet, application tier, and internal database enclaves.

3. **Evaluate each architectural element against applicable STRIDE threat categories.**:
   - Evaluate each architectural element against applicable STRIDE threat categories.

4. **Document explicit architectural mitigations (e.g. TLS for tampering, HMAC for repudiation).**:
   - Document explicit architectural mitigations (e.g. TLS for tampering, HMAC for repudiation).

## Recommended Tools & Environments
- STRIDE Threat Modeling
- Data Flow Diagrams (DFD)
- Architecture Review
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
