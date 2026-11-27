---
name: cleanlab-hallucination-detector
description: Detects untrustworthy responses and hallucinations in LLM outputs using Cleanlab Studio trust scores. Use when flagging low-confidence agent responses in enterprise workflows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/cleanlab/cleanlab"
---
# Cleanlab Hallucination Detector

## Overview
Cleanlab estimates prediction uncertainty and trustworthiness in generative model outputs, computing statistical trust scores to catch hallucinations before users see them.

## Operational Workflow

1. **Feed input prompt, retrieved context, and model output into Cleanlab Trustworthiness scorer.**:
   - Feed input prompt, retrieved context, and model output into Cleanlab Trustworthiness scorer.

2. **Compute factual consistency, response quality, and uncertainty score metrics.**:
   - Compute factual consistency, response quality, and uncertainty score metrics.

3. **Apply threshold filtering**:
   - Apply threshold filtering: route responses with trust score < 0.7 to human review queues.

4. **Log low-trust examples for targeted fine-tuning and retrieval expansion.**:
   - Log low-trust examples for targeted fine-tuning and retrieval expansion.

## Recommended Tools & Environments
- Python 3.10+
- Cleanlab Studio
- Scikit-Learn
- Pandas

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
