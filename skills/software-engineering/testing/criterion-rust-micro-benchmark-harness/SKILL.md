---
name: criterion-rust-micro-benchmark-harness
description: Measures CPU clock cycles, execution latency, and throughput of algorithms using Rust Criterion.rs. Use when preventing performance regressions in high-speed systems programming.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/bheisler/criterion.rs"
---
# Criterion Rust Micro Benchmark Harness

## Overview
Criterion.rs provides statistics-driven microbenchmarking for Rust code, analyzing execution time distributions, detecting regressions, and generating interactive HTML graphs.

## Operational Workflow

1. **Add criterion to [dev-dependencies] in Cargo.toml and create benches/my_benchmark.rs.**:
   - Add criterion to [dev-dependencies] in Cargo.toml and create benches/my_benchmark.rs.

2. **Define benchmark function using c.bench_function("algorithm_name", |b| b.iter(|| algorithm(&data))).**:
   - Define benchmark function using c.bench_function("algorithm_name", |b| b.iter(|| algorithm(&data))).

3. **Execute cargo bench to run thousands of iterations and calculate mean, median, and standard deviation.**:
   - Execute cargo bench to run thousands of iterations and calculate mean, median, and standard deviation.

4. **Criterion automatically compares results against previous runs and warns if regression exceeds threshold.**:
   - Criterion automatically compares results against previous runs and warns if regression exceeds threshold.

## Recommended Tools & Environments
- Criterion.rs
- Rust
- Microbenchmarking
- Performance Engineering

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
