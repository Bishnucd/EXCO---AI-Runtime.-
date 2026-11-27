---
name: meeting-action-item-extractor-nlp
description: Extracts committed action items, owners, and due dates from conversational meeting transcripts using NLP. Use when automating meeting minutes and task creation in Jira or Linear.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://spacy.io/usage/linguistic-features"
---
# Meeting Action Item Extractor Nlp

## Overview
Action items get buried in conversational transcripts. Linguistic dependency parsing and prompt extraction isolate commitment phrases ("I will send the report by Friday") into structured tasks.

## Operational Workflow

1. **Ingest raw meeting transcript segments with speaker attribution.**:
   - Ingest raw meeting transcript segments with speaker attribution.

2. **Identify commitment verbs and future tense auxiliary patterns.**:
   - Identify commitment verbs and future tense auxiliary patterns.

3. **Extract task description, assigned owner (speaker/participant), and explicit/inferred deadline.**:
   - Extract task description, assigned owner (speaker/participant), and explicit/inferred deadline.

4. **Format tasks into structured JSON and post tickets directly to project trackers.**:
   - Format tasks into structured JSON and post tickets directly to project trackers.

## Recommended Tools & Environments
- Python 3.10+
- spaCy / LLM
- Action Item Detection
- Linear / Jira API

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
