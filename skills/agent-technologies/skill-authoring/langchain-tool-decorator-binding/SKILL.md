---
name: langchain-tool-decorator-binding
description: Constructs custom LangChain BaseTool implementations with Pydantic argument schemas and async handlers. Use when authoring tool interfaces for LangGraph and LangChain agents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://python.langchain.com/docs/modules/tools/"
---
# Langchain Tool Decorator Binding

## Overview
LangChain agents require robust tool definitions with explicit args_schema, error handling, and asynchronous _arun execution for non-blocking I/O operations.

## Operational Workflow

1. **Define tool argument schema class inheriting from pydantic.BaseModel.**:
   - Define tool argument schema class inheriting from pydantic.BaseModel.

2. **Implement custom class inheriting from BaseTool with name, description, and args_schema.**:
   - Implement custom class inheriting from BaseTool with name, description, and args_schema.

3. **Implement synchronous _run() and asynchronous _arun() execution handlers.**:
   - Implement synchronous _run() and asynchronous _arun() execution handlers.

4. **Configure handle_tool_error callback to catch exceptions and return informative prompts.**:
   - Configure handle_tool_error callback to catch exceptions and return informative prompts.

## Recommended Tools & Environments
- LangChain
- Python 3.10+
- Pydantic V2
- asyncio

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
