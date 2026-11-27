---
name: sql-injection-prepared-statement-auditor
description: Audits database query construction across codebases to ensure 100% parameterized query and prepared statement enforcement. Use when eliminating SQL injection vulnerabilities.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html"
---
# Sql Injection Prepared Statement Auditor

## Overview
String concatenation or f-strings in SQL queries allow attackers to bypass authentication and dump databases. Automated audits ensure all queries utilize parameterized placeholders ($1, ?).

## Operational Workflow

1. **Scan codebase abstract syntax trees for SQL execution functions accepting concatenated strings.**:
   - Scan codebase abstract syntax trees for SQL execution functions accepting concatenated strings.

2. **Verify that all query arguments pass through parameterized driver bindings or ORM models.**:
   - Verify that all query arguments pass through parameterized driver bindings or ORM models.

3. **Audit dynamic ORDER BY and table name clauses, enforcing strict whitelists instead of raw input.**:
   - Audit dynamic ORDER BY and table name clauses, enforcing strict whitelists instead of raw input.

4. **Fail CI builds when raw string interpolation is detected within database query scopes.**:
   - Fail CI builds when raw string interpolation is detected within database query scopes.

## Recommended Tools & Environments
- OWASP SQLi Prevention
- Static Analysis
- Prepared Statements
- SQLAlchemy / pg

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
