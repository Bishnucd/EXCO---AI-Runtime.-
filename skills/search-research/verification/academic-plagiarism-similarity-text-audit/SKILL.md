---
name: academic-plagiarism-similarity-text-audit
description: Compares document texts against published web and academic corpora using n-gram overlap and semantic text matching. Use when verifying original authorship and detecting plagiarism.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://en.wikipedia.org/wiki/Plagiarism_detection"
---
# Academic Plagiarism Similarity Text Audit

## Overview
Plagiarism detection decomposes text into sliding n-gram shingles, calculating Jaccard similarity and MinHash signatures against millions of indexed academic articles and web pages.

## Operational Workflow

1. **Tokenize document text into 5-word to 8-word overlapping n-gram shingles.**:
   - Tokenize document text into 5-word to 8-word overlapping n-gram shingles.

2. **Compute MinHash fingerprints to search large reference databases in sub-linear time.**:
   - Compute MinHash fingerprints to search large reference databases in sub-linear time.

3. **Identify verbatim matched sentence sequences and evaluate attribution citations.**:
   - Identify verbatim matched sentence sequences and evaluate attribution citations.

4. **Generate highlighted similarity report calculating total percentage of non-original content.**:
   - Generate highlighted similarity report calculating total percentage of non-original content.

## Recommended Tools & Environments
- Plagiarism Detection
- N-Gram Overlap
- String Similarity
- Text Forensics

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
