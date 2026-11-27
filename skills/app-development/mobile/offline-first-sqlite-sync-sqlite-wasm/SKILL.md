---
name: offline-first-sqlite-sync-sqlite-wasm
description: Architects offline-first local SQLite databases with synchronization engines (WatermelonDB / PowerSync). Use when building mobile applications that work seamlessly without internet connectivity.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nozbe.github.io/WatermelonDB/"
---
# Offline First Sqlite Sync Sqlite Wasm

## Overview
Mobile apps in elevators or subways must remain fully responsive. Offline-first architectures write reads and writes to local SQLite, synchronizing changes to cloud backends in the background.

## Operational Workflow

1. **Define relational schema with local tables, primary keys, and sync tracking timestamp columns.**:
   - Define relational schema with local tables, primary keys, and sync tracking timestamp columns.

2. **Execute all user UI reads and writes directly against local embedded SQLite database.**:
   - Execute all user UI reads and writes directly against local embedded SQLite database.

3. **Queue outbound mutations in local sync changelog tables when offline.**:
   - Queue outbound mutations in local sync changelog tables when offline.

4. **Execute two-way background sync reconciling remote updates using conflict resolution rules.**:
   - Execute two-way background sync reconciling remote updates using conflict resolution rules.

## Recommended Tools & Environments
- SQLite
- WatermelonDB / PowerSync
- CRDTs
- TypeScript / Kotlin

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
