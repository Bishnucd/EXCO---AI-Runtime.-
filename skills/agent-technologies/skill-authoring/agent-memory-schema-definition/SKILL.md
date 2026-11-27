---
name: agent-memory-schema-definition
description: Designs structured episodic and semantic memory schemas for long-running AI agent sessions. Use when implementing persistent memory, user preferences, and stateful agent history.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/cpacker/MemGPT"
---
# Agent Memory Schema Definition

## Overview
Agents lose context when conversation histories overflow token limits. Structuring memory into working memory, archival memory, and recall storage enables stateful multi-session continuity.

## Operational Workflow

1. **Define memory taxonomy**:
   - Define memory taxonomy: Core Memory (persona/user), Recall Storage (dialogue), Archival (vector index).

2. **Create CRUD memory tools allowing the agent to read, update, and search its own memory banks.**:
   - Create CRUD memory tools allowing the agent to read, update, and search its own memory banks.

3. **Implement memory consolidation triggers to summarize long dialogue windows into archival storage.**:
   - Implement memory consolidation triggers to summarize long dialogue windows into archival storage.

4. **Inject relevant memory snippets into system prompts during session initialization.**:
   - Inject relevant memory snippets into system prompts during session initialization.

## Recommended Tools & Environments
- MemGPT / Letta
- Postgres / pgvector
- JSON Schema
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
