---
name: lora-peft-model-fine-tuning
description: Fine-tunes open-source language models using Low-Rank Adaptation (LoRA) and Parameter-Efficient Fine-Tuning (PEFT). Use when adapting open-weights models to specialized domain tasks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://huggingface.co/docs/peft/index"
---
# Lora Peft Model Fine Tuning

## Overview
Full model fine-tuning requires massive GPU VRAM. LoRA freezes original model weights and injects trainable rank-decomposition matrices, slashing memory requirements by up to 80% while retaining quality.

## Operational Workflow

1. **Format domain training data into instruction-tuning conversation pairs (sharegpt or alpaca format).**:
   - Format domain training data into instruction-tuning conversation pairs (sharegpt or alpaca format).

2. **Quantize base model weights to 4-bit (QLoRA) using bitsandbytes.**:
   - Quantize base model weights to 4-bit (QLoRA) using bitsandbytes.

3. **Configure LoraConfig specifying rank (r=16), alpha (lora_alpha=32), and target attention projection modules.**:
   - Configure LoraConfig specifying rank (r=16), alpha (lora_alpha=32), and target attention projection modules.

4. **Train adapter weights with SFTTrainer and merge adapter weights into base model for deployment.**:
   - Train adapter weights with SFTTrainer and merge adapter weights into base model for deployment.

## Recommended Tools & Environments
- PyTorch
- HuggingFace Transformers
- PEFT / LoRA
- bitsandbytes

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
