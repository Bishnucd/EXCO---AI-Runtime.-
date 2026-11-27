---
name: aws-glue-crawler-data-catalog-sync
description: Discovers schema structures and synchronizes AWS Glue Data Catalog tables using Glue Crawlers. Use when cataloging new data lake partitions on S3 for Amazon Athena queries.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html"
---
# Aws Glue Crawler Data Catalog Sync

## Overview
AWS Glue Crawlers inspect file formats, extract schema definitions, and populate the AWS Glue Data Catalog, enabling serverless SQL queries in Amazon Athena over partitioned S3 data.

## Operational Workflow

1. **Configure Glue Crawler targeting S3 data lake bucket paths and prefix partition schemes.**:
   - Configure Glue Crawler targeting S3 data lake bucket paths and prefix partition schemes.

2. **Set schema update behaviors (update table definition, ignore schema changes, add new columns).**:
   - Set schema update behaviors (update table definition, ignore schema changes, add new columns).

3. **Trigger crawler execution via AWS EventBridge on S3 ObjectCreated events or cron schedule.**:
   - Trigger crawler execution via AWS EventBridge on S3 ObjectCreated events or cron schedule.

4. **Verify updated table schemas, partition keys, and queryability in Amazon Athena.**:
   - Verify updated table schemas, partition keys, and queryability in Amazon Athena.

## Recommended Tools & Environments
- AWS Glue
- S3 Data Lake
- Amazon Athena
- Schema Discovery

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
