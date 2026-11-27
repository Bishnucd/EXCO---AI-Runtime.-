---
name: bm25-tokenizer-custom-stopword-tuning
description: Configures BM25 sparse keyword retrieval with domain-specific tokenization, stemmers, and stopword lists. Use when fine-tuning sparse lexical search engines in hybrid RAG systems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/dorianbrown/rank_bm25"
---
# Bm25 Tokenizer Custom Stopword Tuning

## Overview
Dense vector search often fails on exact acronyms, part numbers, and code tokens. BM25 sparse retrieval provides exact lexical matching weighted by term frequency and inverse document frequency.

## Operational Workflow

1. **Configure domain tokenizer preserving hyphenated SKU codes, camelCase words, and code symbols.**:
   - Configure domain tokenizer preserving hyphenated SKU codes, camelCase words, and code symbols.

2. **Customize stopword exclusion dictionaries to retain critical single-letter domain tokens.**:
   - Customize stopword exclusion dictionaries to retain critical single-letter domain tokens.

3. **Tune BM25 k1 (term saturation) and b (passage length normalization) hyperparameters.**:
   - Tune BM25 k1 (term saturation) and b (passage length normalization) hyperparameters.

4. **Score and rank candidate passages against raw query tokens with sub-millisecond execution.**:
   - Score and rank candidate passages against raw query tokens with sub-millisecond execution.

## Recommended Tools & Environments
- Rank-BM25
- NLTK / SpaCy
- Lexical Search
- Tokenization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
