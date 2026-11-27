---
name: singer-tap-target-jsonl-etl
description: Implements open-source Singer standard taps and targets for modular data extraction and loading. Use when building reusable, interoperable ETL connectors across various APIs and warehouses.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.singer.io/"
---
# Singer Tap Target Jsonl Etl

## Overview
The Singer specification defines how data extraction scripts (taps) and data loading scripts (targets) communicate via standard UNIX pipes and JSON Lines streams with state persistence.

## Operational Workflow

1. **Configure Singer tap with API credentials, target entities, and state file for incremental syncs.**:
   - Configure Singer tap with API credentials, target entities, and state file for incremental syncs.

2. **Stream SCHEMA, RECORD, and STATE messages from tap standard output.**:
   - Stream SCHEMA, RECORD, and STATE messages from tap standard output.

3. **Pipe stdout stream directly into Singer target input (e.g., tap-salesforce | target-snowflake).**:
   - Pipe stdout stream directly into Singer target input (e.g., tap-salesforce | target-snowflake).

4. **Save emitted STATE message to maintain cursor bookmark for subsequent incremental runs.**:
   - Save emitted STATE message to maintain cursor bookmark for subsequent incremental runs.

## Recommended Tools & Environments
- Singer Specification
- Python / Meltano
- JSONL Streams
- ELT

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
