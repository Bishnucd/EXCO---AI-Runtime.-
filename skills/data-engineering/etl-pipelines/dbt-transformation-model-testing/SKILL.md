---
name: dbt-transformation-model-testing
description: Defines modular SQL transformation models and automated schema tests using dbt (data build tool). Use when organizing warehouse transformations into tested, DAG-driven pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.getdbt.com/docs/build/models"
---
# Dbt Transformation Model Testing

## Overview
dbt enables analytics engineers to build data warehouse transformations as modular SQL select statements. Integrated tests (unique, not_null, accepted_values) guarantee data reliability.

## Operational Workflow

1. **Structure layered transformation models**:
   - Structure layered transformation models: staging, intermediate, and dimensional marts.

2. **Author declarative YAML schema tests validating primary keys, non-null constraints, and relationships.**:
   - Author declarative YAML schema tests validating primary keys, non-null constraints, and relationships.

3. **Execute dbt run and dbt test to materialize views/tables and verify constraint assertions.**:
   - Execute dbt run and dbt test to materialize views/tables and verify constraint assertions.

4. **Generate and publish automated lineage DAG graphs and interactive data dictionary docs.**:
   - Generate and publish automated lineage DAG graphs and interactive data dictionary docs.

## Recommended Tools & Environments
- dbt-core
- SQL (Snowflake, BigQuery)
- Jinja
- YAML

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
