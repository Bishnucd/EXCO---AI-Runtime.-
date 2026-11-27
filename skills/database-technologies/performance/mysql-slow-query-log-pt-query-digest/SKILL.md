---
name: mysql-slow-query-log-pt-query-digest
description: Profiles and analyzes MySQL slow query logs using Percona pt-query-digest. Use when debugging high MySQL latency and prioritizing query tuning initiatives.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.percona.com/percona-toolkit/pt-query-digest.html"
---
# Mysql Slow Query Log Pt Query Digest

## Overview
pt-query-digest aggregates and parses gigabytes of MySQL slow query logs, generating statistical distribution summaries of query classes ranked by cumulative lock and execution time.

## Operational Workflow

1. **Enable slow_query_log = 1 and set long_query_time = 0.5 in my.cnf.**:
   - Enable slow_query_log = 1 and set long_query_time = 0.5 in my.cnf.

2. **Collect slow query log over representative peak traffic periods.**:
   - Collect slow query log over representative peak traffic periods.

3. **Execute pt-query-digest /var/log/mysql/slow.log > query_digest_report.txt.**:
   - Execute pt-query-digest /var/log/mysql/slow.log > query_digest_report.txt.

4. **Review ranked query classes, 95th percentile execution durations, and examined row ratios.**:
   - Review ranked query classes, 95th percentile execution durations, and examined row ratios.

## Recommended Tools & Environments
- Percona Toolkit
- pt-query-digest
- MySQL Slow Log
- Query Profiling

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
