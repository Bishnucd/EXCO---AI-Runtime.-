---
name: ghost-mysql-zero-downtime-online-alter
description: Executes non-blocking, triggerless MySQL schema alterations on production databases using GitHub gh-ost. Use when altering massive multi-terabyte MySQL tables without downtime or locks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/github/gh-ost"
---
# Ghost Mysql Zero Downtime Online Alter

## Overview
gh-ost alters MySQL tables without triggers by reading the binary log stream, copying historical rows to a ghost table in the background, and performing a microscopic cut-over.

## Operational Workflow

1. **Configure gh-ost connection flags pointing to replica or master MySQL instance.**:
   - Configure gh-ost connection flags pointing to replica or master MySQL instance.

2. **Specify alter statement (e.g., ADD COLUMN status VARCHAR(32) DEFAULT NULL).**:
   - Specify alter statement (e.g., ADD COLUMN status VARCHAR(32) DEFAULT NULL).

3. **Monitor ghost table row copying rate, replication lag, and dynamic throttling.**:
   - Monitor ghost table row copying rate, replication lag, and dynamic throttling.

4. **Execute atomic table swap cut-over to promote altered ghost table to production.**:
   - Execute atomic table swap cut-over to promote altered ghost table to production.

## Recommended Tools & Environments
- gh-ost (GitHub)
- MySQL
- Binlog Replication
- Zero Downtime

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
