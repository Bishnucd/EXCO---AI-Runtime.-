---
name: helm-holistic-eval-benchmark
description: Measures multi-metric transparency and model capabilities using Stanford Holistic Evaluation of Language Models (HELM). Use when conducting comprehensive model audits across fairness, bias, and accuracy.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/stanford-crfm/helm"
---
# Helm Holistic Eval Benchmark

## Overview
HELM evaluates language models across a multi-dimensional taxonomy including accuracy, calibration, robustness, fairness, bias, toxicity, and efficiency across standardized scenarios.

## Operational Workflow

1. **Define evaluation run spec selecting target scenarios (e.g. BoolQ, IMDB, CivilComments).**:
   - Define evaluation run spec selecting target scenarios (e.g. BoolQ, IMDB, CivilComments).

2. **Configure model adaptation parameters (temperature, max tokens, stop sequences).**:
   - Configure model adaptation parameters (temperature, max tokens, stop sequences).

3. **Execute HELM runner to execute queries and compute multi-metric evaluation tables.**:
   - Execute HELM runner to execute queries and compute multi-metric evaluation tables.

4. **Generate static HTML report visualizing performance trade-offs across capability dimensions.**:
   - Generate static HTML report visualizing performance trade-offs across capability dimensions.

## Recommended Tools & Environments
- Stanford HELM
- Python 3.10+
- Pandas
- Jupyter

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
