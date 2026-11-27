---
name: semantic-kernel-plugin-definition
description: Authors native and semantic plugins for Microsoft Semantic Kernel using typed decorators. Use when building enterprise AI skills within Microsoft Semantic Kernel architectures.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/microsoft/semantic-kernel"
---
# Semantic Kernel Plugin Definition

## Overview
Microsoft Semantic Kernel organizes AI capabilities into modular Plugins. Decorating native methods with @kernel_function exposes them for automated planner orchestration.

## Operational Workflow

1. **Author Python or C# class containing domain logic and external integrations.**:
   - Author Python or C# class containing domain logic and external integrations.

2. **Decorate methods with @kernel_function and annotate arguments with descriptions.**:
   - Decorate methods with @kernel_function and annotate arguments with descriptions.

3. **Register plugin into Kernel instance alongside planner and connector services.**:
   - Register plugin into Kernel instance alongside planner and connector services.

4. **Invoke plugin methods directly or allow kernel automatic function calling to plan execution.**:
   - Invoke plugin methods directly or allow kernel automatic function calling to plan execution.

## Recommended Tools & Environments
- Semantic Kernel
- C# / Python
- OpenAI / Azure
- JSON

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
