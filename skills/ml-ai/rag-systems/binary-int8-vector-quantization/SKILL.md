---
name: binary-int8-vector-quantization
description: Applies scalar INT8 and 1-bit binary vector quantization to accelerate vector search and reduce RAM by 32x. Use when scaling in-memory vector databases to hundreds of millions of items.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://qdrant.tech/articles/binary-quantization/"
---
# Binary Int8 Vector Quantization

## Overview
Quantization compresses 32-bit floating point vectors into 8-bit integers or 1-bit binary flags, enabling hardware SIMD Hamming distance operations that execute in nanoseconds.

## Operational Workflow

1. **Analyze embedding distribution across dataset to calculate scalar quantization thresholds.**:
   - Analyze embedding distribution across dataset to calculate scalar quantization thresholds.

2. **Convert float32 vectors into 1-bit binary vectors where positive values become 1 and negatives 0.**:
   - Convert float32 vectors into 1-bit binary vectors where positive values become 1 and negatives 0.

3. **Execute high-speed candidate filtering over binary vectors using XOR and POPCNT CPU instructions.**:
   - Execute high-speed candidate filtering over binary vectors using XOR and POPCNT CPU instructions.

4. **Perform rescore pass on top-100 candidates using original float32 vectors or oversampled INT8.**:
   - Perform rescore pass on top-100 candidates using original float32 vectors or oversampled INT8.

## Recommended Tools & Environments
- Binary Quantization (BQ)
- Scalar Quantization (SQ)
- SIMD / Hamming Distance
- Vector DB

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
