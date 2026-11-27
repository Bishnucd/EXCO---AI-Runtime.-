---
name: agentic-rag-adaptive-query-routing
description: Routes user queries dynamically between vector databases, SQL data warehouses, and web search using LLM tool routing. Use when queries require diverse data sources or multi-step logic.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.llamaindex.ai/en/stable/examples/agent/agentic_rag/"
---
# Agentic Rag Adaptive Query Routing

## Overview
Static RAG always queries the same vector store. Agentic RAG analyzes query intent to decide whether to query a vector store, execute a SQL aggregate query, or trigger live web searches.

## Operational Workflow

1. **Register data source query tools (VectorIndexTool, SQLDatabaseTool, WebSearchTool).**:
   - Register data source query tools (VectorIndexTool, SQLDatabaseTool, WebSearchTool).

2. **Prompt supervisor agent to classify incoming user query and determine required tool strategy.**:
   - Prompt supervisor agent to classify incoming user query and determine required tool strategy.

3. **Execute multi-hop tool invocations (e.g., query SQL for sales numbers, then vector store for product context).**:
   - Execute multi-hop tool invocations (e.g., query SQL for sales numbers, then vector store for product context).

4. **Synthesize multi-source retrieved evidence into a coherent, cited final response.**:
   - Synthesize multi-source retrieved evidence into a coherent, cited final response.

## Recommended Tools & Environments
- Agentic RAG
- Router Query Engine
- Tool Calling
- LangGraph / LlamaIndex

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
