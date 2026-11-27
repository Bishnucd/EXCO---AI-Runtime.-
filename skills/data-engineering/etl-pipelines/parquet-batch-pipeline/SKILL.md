---
name: parquet-batch-pipeline
description: Builds scalable batch ETL pipelines using Apache Arrow and Parquet columnar formatting with schema evolution and partitioning. Use when processing, transforming, and storing high-volume analytical datasets efficiently.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://arrow.apache.org/docs/"
---

# Parquet Batch Pipeline

## Overview
Efficient data lakes and analytical warehouses depend on columnar storage to minimize disk I/O and optimize analytical queries. This skill provides instructions for designing batch data pipelines that ingest row-based data (CSV, JSON, SQL dumps), apply vectorized transformations, enforce schema validation, and output partitioned Apache Parquet files.

## Operational Workflow

1. **Schema Definition & Ingestion**:
   - Define strict PyArrow or Polars schemas specifying column data types, nullability, and metadata dictionary tags.
   - Read input stream or batches using chunked readers to avoid out-of-memory (OOM) errors on large datasets.

2. **Data Cleaning & Transformation**:
   - Cast types explicitly (e.g. timestamp strings to ISO 8601 UTC timestamps, integer IDs to int64).
   - Filter invalid rows, impute or quarantine nulls, and deduplicate against primary transaction keys.
   - Compute derived analytical metrics using vectorized operations.

3. **Partitioning Strategy**:
   - Determine partitioning columns based on dominant query access patterns (typically temporal: `year=YYYY/month=MM/day=DD` or categorical: `region=XX`).
   - Avoid over-partitioning that produces files smaller than 128MB (the "small file problem").

4. **Columnar Writing & Compression**:
   - Write out tables using Snappy or ZSTD compression algorithms.
   - Enforce dictionary encoding for high-cardinality string columns.
   - Generate metadata index footers to accelerate query engine predicate pushdown (DuckDB, Spark, BigQuery).
