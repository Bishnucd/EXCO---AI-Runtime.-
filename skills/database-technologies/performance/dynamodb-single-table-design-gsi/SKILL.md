---
name: dynamodb-single-table-design-gsi
description: Implements DynamoDB single-table architecture using generic partition keys, sort keys, and Global Secondary Indexes (GSIs). Use when building predictable sub-10ms serverless data layers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-strategy.html"
---
# Dynamodb Single Table Design Gsi

## Overview
DynamoDB single-table design collapses relational entities into one physical table using composite keys (PK, SK), retrieving parent items and child collections in a single Query call.

## Operational Workflow

1. **Document all entity access patterns in an access pattern matrix.**:
   - Document all entity access patterns in an access pattern matrix.

2. **Define generic partition key PK (e.g., ORG#123) and sort key SK (e.g., USER#456).**:
   - Define generic partition key PK (e.g., ORG#123) and sort key SK (e.g., USER#456).

3. **Create sparse Global Secondary Indexes (GSI1PK, GSI1SK) to support inverted queries.**:
   - Create sparse Global Secondary Indexes (GSI1PK, GSI1SK) to support inverted queries.

4. **Execute KeyConditionExpression queries to fetch related entities in a single atomic request.**:
   - Execute KeyConditionExpression queries to fetch related entities in a single atomic request.

## Recommended Tools & Environments
- Amazon DynamoDB
- Single-Table Design
- Global Secondary Indexes (GSI)
- Serverless

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
