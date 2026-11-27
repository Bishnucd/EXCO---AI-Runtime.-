---
name: neptune-ai-experiment-tracker
description: Logs hyperparameters, loss curves, and evaluation scorecards for LLM fine-tuning using Neptune.ai. Use when managing machine learning experiment tracking and model registry artifacts.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/neptune-ai/neptune-client"
---
# Neptune Ai Experiment Tracker

## Overview
Neptune provides centralized experiment tracking for machine learning teams, organizing runs, metrics, hardware utilization, and model artifacts with full reproducibility.

## Operational Workflow

1. **Initialize neptune.init_run() passing project namespace and experiment metadata tags.**:
   - Initialize neptune.init_run() passing project namespace and experiment metadata tags.

2. **Log training hyperparameters, dataset versions, and learning rate schedules.**:
   - Log training hyperparameters, dataset versions, and learning rate schedules.

3. **Stream training loss, validation perplexity, and evaluation metrics in real time.**:
   - Stream training loss, validation perplexity, and evaluation metrics in real time.

4. **Upload trained LoRA adapter weights and confusion matrices to the Neptune model registry.**:
   - Upload trained LoRA adapter weights and confusion matrices to the Neptune model registry.

## Recommended Tools & Environments
- Neptune.ai
- Python 3.10+
- PyTorch
- HuggingFace

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
