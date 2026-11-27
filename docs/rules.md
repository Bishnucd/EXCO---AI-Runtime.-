---
name: rules
description: Twenty mandatory engineering rules for all EXCO implementations
type: project
---

# EXCO Engineering Rules — Twenty Mandatory Principles

Every implementation in the EXCO codebase must comply with these principles. Review all twenty rules before finalizing substantial implementations. Correct violations or document justified exceptions.

## Rule 01 — Original Code
Write original, idiomatic implementations. Respect licenses and intellectual property rights. Do not copy proprietary code without authorization.

## Rule 02 — Naming Compliance
Use descriptive and appropriate identifiers. Avoid unauthorized proprietary branding or misleading names. Follow language conventions (camelCase for TS/JS, PascalCase for types/components).

## Rule 03 — Strict Type Safety
Use strict typing wherever supported. Enable TypeScript strict mode and appropriate annotations. Avoid unnecessary `any` and unsafe type conversions. Use `unknown` over `any` when type is uncertain.

## Rule 04 — Dependency Integrity
Verify that every imported package exists in the dependency manifest and is compatible with the project. Audit dependencies regularly. Prefer pinned versions over ranges.

## Rule 05 — Explicit Error Handling
Never silently swallow errors. Use meaningful error handling and appropriate diagnostic logging. Every catch block must either handle, rethrow with context, or explicitly document why the error is ignored.

## Rule 06 — Single Responsibility
Keep functions, modules, classes, and services focused on defined responsibilities. A module should have one reason to change. Split when a file exceeds ~300 lines or handles multiple concerns.

## Rule 07 — Secret Management
Never hardcode passwords, API keys, tokens, or credentials. Use secure environment variables or approved secret-management systems. The credential vault must encrypt at rest.

## Rule 08 — Input Validation
Validate external inputs and protect against injection, malformed payloads, path traversal, and unauthorized access. Use schema validation (Zod) at IPC boundaries and API entry points.

## Rule 09 — Atomic File Operations
Use safe, atomic file-writing strategies wherever appropriate. Write to temporary files then rename. Use transactions for database operations.

## Rule 10 — State Immutability
Prefer predictable state transitions, immutable structures, and pure functions where practical. Use Immer for mutable-style immutable updates in React state.

## Rule 11 — Documentation
Document exported functions, public APIs, important interfaces, and complex business logic. Use JSDoc/TSDoc for TypeScript. Keep documentation adjacent to code.

## Rule 12 — Resource Management
Use structured resource management for files, connections, sockets, and other external resources. Implement proper cleanup in `useEffect` return functions and Electron `before-quit` handlers.

## Rule 13 — Idempotency
Ensure automation, migrations, deployment operations, and scripts can be safely repeated where applicable. Design operations to be idempotent by default.

## Rule 14 — Testability
Provide appropriate unit, integration, and end-to-end tests for critical functionality. Target >80% coverage for business logic. Tests must be fast, deterministic, and isolated.

## Rule 15 — Layer Separation
Separate presentation, business logic, API communication, persistence, and infrastructure. Main process handles system operations; renderer handles UI; shared contains pure types/logic.

## Rule 16 — Code Consistency
Follow established formatting, linting, naming, and project conventions. Use ESLint + Prettier with shared config. Run lint/typecheck in CI.

## Rule 17 — Actionable Errors
Produce clear diagnostic messages without exposing sensitive information. Error messages should help users resolve issues, not just state what failed.

## Rule 18 — Minimal Dependencies
Prefer standard libraries and lightweight, maintained dependencies when practical. Audit bundle size. Avoid dependencies for trivial utilities.

## Rule 19 — Backward Compatibility
Preserve existing APIs, interfaces, and data contracts unless breaking changes are explicitly requested. Version IPC channels and database schemas.

## Rule 20 — Mandatory Rule Verification
Review all twenty rules before finalizing substantial implementations. Correct violations or document justified exceptions in the implementation notes.

---

## Enforcement Checklist (run before each PR/commit)
- [ ] TypeScript strict mode passes (`tsc --noEmit`)
- [ ] ESLint passes with zero errors
- [ ] No `any` types without justification comment
- [ ] No hardcoded secrets (grep for common patterns)
- [ ] All IPC handlers validate input with Zod schemas
- [ ] All file writes use atomic strategy
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated for public APIs
- [ ] No circular dependencies (check with `madge`)
- [ ] Bundle size within budget