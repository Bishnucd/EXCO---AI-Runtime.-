---
name: algolia-instant-search-index-sync
description: Synchronizes database records into Algolia search indices with incremental diff batching. Use when delivering typo-tolerant, instant search-as-you-type experiences.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.algolia.com/doc/guides/sending-and-managing-data/send-and-update-your-data/"
---
# Algolia Instant Search Index Sync

## Overview
Relational databases are slow at fuzzy typo-tolerant full-text search. Algolia provides hosted search APIs optimized for sub-10ms response times, configured via synchronized JSON records.

## Operational Workflow

1. **Configure Algolia index settings**:
   - Configure Algolia index settings: searchableAttributes, customRanking, and attributesForFaceting.

2. **Format database entities into JSON objects with unique objectID matching primary keys.**:
   - Format database entities into JSON objects with unique objectID matching primary keys.

3. **Execute incremental batch updates using index.saveObjects(records) upon database create/update events.**:
   - Execute incremental batch updates using index.saveObjects(records) upon database create/update events.

4. **Handle record deletions by calling index.deleteObject(id) upon entity removal.**:
   - Handle record deletions by calling index.deleteObject(id) upon entity removal.

## Recommended Tools & Environments
- Algolia
- InstantSearch
- Index Synchronization
- Search as you Type

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
