---
name: mongodb-compound-index-esr-rule
description: Optimizes MongoDB compound indexes using the Equality, Sort, Range (ESR) rule. Use when eliminating in-memory sorting and excessive document scanning in MongoDB queries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.mongodb.com/docs/manual/tutorial/equality-sort-range-rule/"
---
# Mongodb Compound Index Esr Rule

## Overview
The ESR (Equality, Sort, Range) rule dictates the precise ordering of fields in a MongoDB compound index to ensure index-covered equality matching, sort operations, and range filtering.

## Operational Workflow

1. **Identify query filter conditions and group fields into Equality, Sort, and Range buckets.**:
   - Identify query filter conditions and group fields into Equality, Sort, and Range buckets.

2. **Create compound index placing all Equality fields first, Sort fields second, and Range fields last.**:
   - Create compound index placing all Equality fields first, Sort fields second, and Range fields last.

3. **Run db.collection.explain("executionStats") against target query.**:
   - Run db.collection.explain("executionStats") against target query.

4. **Verify that totalDocsExamined matches nReturned and totalKeysExamined represents a tight index scan.**:
   - Verify that totalDocsExamined matches nReturned and totalKeysExamined represents a tight index scan.

## Recommended Tools & Environments
- MongoDB
- ESR Rule
- Compound Indexes
- Query Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
