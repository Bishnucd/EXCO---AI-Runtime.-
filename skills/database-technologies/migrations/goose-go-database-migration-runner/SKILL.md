---
name: goose-go-database-migration-runner
description: Executes lightweight, binary-embedded SQL and Go database migrations using Pressly Goose. Use when managing database versions in Go microservices without heavy runtimes.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/pressly/goose"
---
# Goose Go Database Migration Runner

## Overview
Goose is a database migration tool that supports plain SQL scripts and Go functions, capable of being compiled directly into Go service binaries using //go:embed.

## Operational Workflow

1. **Create migration file using goose create add_indexes sql.**:
   - Create migration file using goose create add_indexes sql.

2. **Write plain SQL statements separated by -- +goose Up and -- +goose Down directives.**:
   - Write plain SQL statements separated by -- +goose Up and -- +goose Down directives.

3. **Embed migration files into Go binary using embed.FS.**:
   - Embed migration files into Go binary using embed.FS.

4. **Execute goose.Up(db, "migrations") during application bootstrapping.**:
   - Execute goose.Up(db, "migrations") during application bootstrapping.

## Recommended Tools & Environments
- Goose
- Go (Golang)
- SQL Migrations
- Embedded Binaries

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
