---
name: apache-airflow-dynamic-dag-generation
description: Generates dynamic, scalable Apache Airflow DAGs using TaskFlow API and dynamic task mapping (.expand()). Use when scaling ETL pipelines across hundreds of variable client configurations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://airflow.apache.org/docs/apache-airflow/stable/authoring-and-scheduling/dynamic-task-mapping.html"
---
# Apache Airflow Dynamic Dag Generation

## Overview
Dynamic task mapping in Airflow allows tasks to spawn parallel instances at runtime based on upstream data outputs, eliminating the need to write redundant static DAG boilerplate.

## Operational Workflow

1. **Declare Airflow DAG using standard context manager or @dag decorator with schedule interval.**:
   - Declare Airflow DAG using standard context manager or @dag decorator with schedule interval.

2. **Define task that returns a list of target database tables, files, or partner tenant IDs.**:
   - Define task that returns a list of target database tables, files, or partner tenant IDs.

3. **Call downstream processing task with .expand(tenant_id=fetch_tenants_task) for runtime parallelization.**:
   - Call downstream processing task with .expand(tenant_id=fetch_tenants_task) for runtime parallelization.

4. **Aggregate distributed task run outputs with downstream summary reporting task.**:
   - Aggregate distributed task run outputs with downstream summary reporting task.

## Recommended Tools & Environments
- Apache Airflow
- TaskFlow API
- Python
- Dynamic DAGs

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
