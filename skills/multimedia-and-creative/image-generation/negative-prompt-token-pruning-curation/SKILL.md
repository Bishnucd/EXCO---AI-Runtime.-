---
name: negative-prompt-token-pruning-curation
description: Prunes bloated negative prompt lists and targets specific generation flaws using calibrated negative tokens. Use when improving prompt adherence and eliminating synthetic artifacts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://stable-diffusion-art.com/negative-prompt/"
---
# Negative Prompt Token Pruning Curation

## Overview
Pasting generic 50-word negative prompt lists degrades image contrast and restricts model creativity. Targeted negative prompting specifies only the precise artifacts relevant to the specific subject.

## Operational Workflow

1. **Identify specific generation errors in test generations (e.g., extra fingers, oversaturation, text).**:
   - Identify specific generation errors in test generations (e.g., extra fingers, oversaturation, text).

2. **Formulate minimal targeted negative prompt tokens (e.g., "(deformed hands**:
   - Formulate minimal targeted negative prompt tokens (e.g., "(deformed hands:1.2), text, watermark").

3. **Avoid vague aesthetic words ("ugly", "bad") that unintentionally strip stylistic diversity.**:
   - Avoid vague aesthetic words ("ugly", "bad") that unintentionally strip stylistic diversity.

4. **Test prompt variations across multiple seeds to verify that negative tokens cure the target defect.**:
   - Test prompt variations across multiple seeds to verify that negative tokens cure the target defect.

## Recommended Tools & Environments
- Negative Prompting
- Token Weighting
- Diffusion Steering
- Prompt Engineering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
