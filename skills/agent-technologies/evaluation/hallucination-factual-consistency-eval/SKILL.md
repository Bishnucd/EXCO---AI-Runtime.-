---
name: hallucination-factual-consistency-eval
description: Measures factual consistency and citation faithfulness between source documents and agent-generated claims. Use when verifying factual accuracy and source alignment in document analysis workflows.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/explodinggradients/ragas"
---
# Hallucination Factual Consistency Eval

## Overview
Factual consistency evaluation decomposes generated answers into atomic factual claims and verifies whether each claim is entailed by the retrieved source context chunks.

## Operational Workflow

1. **Segment generated response text into discrete atomic proposition statements.**:
   - Segment generated response text into discrete atomic proposition statements.

2. **Extract cited source contexts associated with each generated claim.**:
   - Extract cited source contexts associated with each generated claim.

3. **Perform natural language inference (NLI) classification to verify premise entailment versus contradiction.**:
   - Perform natural language inference (NLI) classification to verify premise entailment versus contradiction.

4. **Calculate faithfulness ratio = (entailed claims) / (total claims) and flag ungrounded assertions.**:
   - Calculate faithfulness ratio = (entailed claims) / (total claims) and flag ungrounded assertions.

## Recommended Tools & Environments
- Python 3.10+
- Ragas
- NLTK
- Spacy

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
