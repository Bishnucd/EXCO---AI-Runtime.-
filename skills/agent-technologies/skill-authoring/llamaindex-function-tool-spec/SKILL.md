---
name: llamaindex-function-tool-spec
description: Builds modular FunctionTool and ToolSpec components for LlamaIndex query agents. Use when connecting data index queries and retrieval engines as callable agent tools.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.llamaindex.ai/en/stable/module_guides/deploying/agents/tools/"
---
# Llamaindex Function Tool Spec

## Overview
LlamaIndex bridges data indexes and language agents. Wrapping QueryEngine instances as FunctionTool objects enables agents to decide when and how to query domain data stores.

## Operational Workflow

1. **Create target QueryEngine or function handler performing domain operations.**:
   - Create target QueryEngine or function handler performing domain operations.

2. **Wrap handler using FunctionTool.from_defaults(fn=..., name=..., description=...).**:
   - Wrap handler using FunctionTool.from_defaults(fn=..., name=..., description=...).

3. **Optionally bundle multiple related functions into a reusable BaseToolSpec subclass.**:
   - Optionally bundle multiple related functions into a reusable BaseToolSpec subclass.

4. **Pass tools list to OpenAIAgent or ReActAgent initialization.**:
   - Pass tools list to OpenAIAgent or ReActAgent initialization.

## Recommended Tools & Environments
- LlamaIndex
- Python 3.10+
- QueryEngine
- FunctionTool

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
