---
name: diff-document-text-comparator
description: Computes character, word, and block-level text diffs between document revisions with HTML visual highlights. Use when auditing contract amendments and tracking document revision histories.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.python.org/3/library/difflib.html"
---
# Diff Document Text Comparator

## Overview
Tracking changes between contract drafts requires semantic diffing. Myers diff algorithms compute added, deleted, and modified word sequences, rendering styled redline comparisons.

## Operational Workflow

1. **Normalize source and modified document texts (strip irregular whitespace, normalize quotes).**:
   - Normalize source and modified document texts (strip irregular whitespace, normalize quotes).

2. **Execute word-level diff matching using diff_match_patch or difflib.SequenceMatcher.**:
   - Execute word-level diff matching using diff_match_patch or difflib.SequenceMatcher.

3. **Generate visual HTML redline report with <ins class="add"> and <del class="remove"> styling.**:
   - Generate visual HTML redline report with <ins class="add"> and <del class="remove"> styling.

4. **Calculate revision similarity scores and summarize net additions and deletions.**:
   - Calculate revision similarity scores and summarize net additions and deletions.

## Recommended Tools & Environments
- Python difflib
- google-diff-match-patch
- HTML Diff
- Markdown

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
