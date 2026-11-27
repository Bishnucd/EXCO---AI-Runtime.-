/**
 * EXCO Governance File Watcher
 * Watches and synchronizes the five governance files between filesystem and database
 */

import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
import {
  EXCO_FOLDER_NAME,
  GOVERNANCE_FILES,
  WATCH_DEBOUNCE_MS,
} from '@shared/constants';
import { getDatabase, setGovernanceFile, getGovernanceFile } from '@main/database';
import { sendToRenderer } from '@main/ipc/handlers';

interface WatcherEntry {
  watcher: fs.FSWatcher;
  debounceTimer: NodeJS.Timeout | null;
}

const watchers: Map<string, WatcherEntry> = new Map();
let activeWorkspacePath: string | null = null;

/**
 * Initialize governance file watching for a workspace
 */
export async function initializeGovernanceWatcher(workspacePath: string): Promise<void> {
  activeWorkspacePath = workspacePath;
  const excoPath = path.join(workspacePath, EXCO_FOLDER_NAME);

  // Ensure .exco directory exists
  if (!fs.existsSync(excoPath)) {
    fs.mkdirSync(excoPath, { recursive: true });
  }

  // Create default governance files if they don't exist
  await createDefaultGovernanceFiles(excoPath);

  // Load existing files into database
  await syncFilesToDatabase(excoPath);

  // Start watching each file
  for (const filename of GOVERNANCE_FILES) {
    await watchFile(excoPath, filename);
  }
}

/**
 * Create default governance files with templates
 */
async function createDefaultGovernanceFiles(excoPath: string): Promise<void> {
  const templates: Record<string, string> = {
    'unsaved.md': `# EXCO Engineering Staging Area

## Current Objective
Describe the current engineering objective here.

## Project Analysis
- **Selected workspace**: \`${activeWorkspacePath}\`
- **Target architecture**:
- **Core modules required**:

## Proposed Technology Stack

## Architecture Decisions

## Dependencies Identified

## Risk Assessment

## Expected Results
`,

    'rules.md': `# EXCO Engineering Rules — Twenty Mandatory Principles

Every implementation in the EXCO codebase must comply with these principles. Review all twenty rules before finalizing substantial implementations. Correct violations or document justified exceptions.

## Rule 01 — Original Code
Write original, idiomatic implementations. Respect licenses and intellectual property rights. Do not copy proprietary code without authorization.

## Rule 02 — Naming Compliance
Use descriptive and appropriate identifiers. Avoid unauthorized proprietary branding or misleading names. Follow language conventions (camelCase for TS/JS, PascalCase for types/components).

## Rule 03 — Strict Type Safety
Use strict typing wherever supported. Enable TypeScript strict mode and appropriate annotations. Avoid unnecessary \`any\` and unsafe type conversions. Use \`unknown\` over \`any\` when type is uncertain.

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
Use structured resource management for files, connections, sockets, and other external resources. Implement proper cleanup in \`useEffect\` return functions and Electron \`before-quit\` handlers.

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
- [ ] TypeScript strict mode passes (\`tsc --noEmit\`)
- [ ] ESLint passes with zero errors
- [ ] No \`any\` types without justification comment
- [ ] No hardcoded secrets (grep for common patterns)
- [ ] All IPC handlers validate input with Zod schemas
- [ ] All file writes use atomic strategy
- [ ] Tests added/updated for new functionality
- [ ] Documentation updated for public APIs
- [ ] No circular dependencies (check with \`madge\`)
- [ ] Bundle size within budget
`,

    'features.md': `# EXCO Feature Inventory

Status indicators: \`[ ]\` Pending | \`[-]\` In Progress | \`[x]\` Completed and Verified

---

## 1. Application Core

### 1.1 Electron Application Shell
- \`[ ]\` Main process initialization and lifecycle management
- \`[ ]\` BrowserWindow creation with security hardening
- \`[ ]\` IPC channel registration and type-safe communication
- \`[ ]\` Application menu (native menus per platform)
- \`[ ]\` Auto-updater integration (electron-updater)
- \`[ ]\` Crash reporting and error boundary
- \`[ ]\` Single instance lock
- \`[ ]\` Protocol handlers for deep linking

### 1.2 Renderer Process (React + Vite)
- \`[ ]\` Vite configuration for Electron renderer
- \`[ ]\` React 18+ with TypeScript strict mode
- \`[ ]\` React Router for SPA navigation
- \`[ ]\` Error boundaries for graceful degradation
- \`[ ]\` Hot module replacement in development
- \`[ ]\` Production build optimization

### 1.3 Preload Scripts (Secure Bridge)
- \`[ ]\` Context isolation enabled
- \`[ ]\` Typed IPC channel exposure via contextBridge
- \`[ ]\` Schema validation for all IPC messages
- \`[ ]\` Secure API surface (no Node.js globals in renderer)

### 1.4 Shared Types & Utilities
- \`[ ]\` TypeScript types for IPC channels
- \`[ ]\` Zod schemas for runtime validation
- \`[ ]\` Shared constants and enums
- \`[ ]\` Utility functions (clsx, date formatting, etc.)

---

*Add more features as needed*
`,

    'update.md': `# EXCO Engineering Change Ledger

Chronological record of meaningful project changes. For major architectural or business-logic modifications, entries include at least 3-4 detailed sentences covering the change, rationale, implementation, and downstream impact.

---

*Changes will be recorded here automatically*
`,

    'flow.md': `# EXCO Execution State and Model Handoff

## Active Objective
Current engineering task.

## Project Context
- **Frameworks**:
- **Languages**:
- **Architecture**:
- **Relevant implementation details**:

## Current Files
- Files being inspected or modified.
- Relevant functions and components.

## Completed Work
- Verified accomplishments.

## Pending Work
- Incomplete implementation.

## Validation
- Tests executed.
- Build results.
- Known failures.

## Blockers
- Unresolved problems.
- Missing requirements.
- Required decisions.

## Next Actions
- Exact next development steps.

---

*Update this file after substantial milestones and before ending significant Work Mode sessions.*
`,
  };

  for (const [filename, content] of Object.entries(templates)) {
    const filePath = path.join(excoPath, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

/**
 * Sync files from filesystem to database
 */
async function syncFilesToDatabase(excoPath: string): Promise<void> {
  for (const filename of GOVERNANCE_FILES) {
    const filePath = path.join(excoPath, filename);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (activeWorkspacePath) {
        setGovernanceFile(activeWorkspacePath, filename, content);
      }
    }
  }
}

/**
 * Watch a single governance file
 */
async function watchFile(excoPath: string, filename: string): Promise<void> {
  const filePath = path.join(excoPath, filename);
  const watchKey = `${activeWorkspacePath}:${filename}`;

  // Remove existing watcher if any
  const existing = watchers.get(watchKey);
  if (existing) {
    existing.watcher.close();
    if (existing.debounceTimer) {
      clearTimeout(existing.debounceTimer);
    }
  }

  // Ensure file exists
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }

  const watcher = fs.watch(filePath, { persistent: true }, (eventType) => {
    if (eventType === 'change') {
      const entry = watchers.get(watchKey);
      if (entry) {
        // Debounce rapid changes
        if (entry.debounceTimer) {
          clearTimeout(entry.debounceTimer);
        }

        entry.debounceTimer = setTimeout(() => {
          handleFileChange(filename);
        }, WATCH_DEBOUNCE_MS);
      }
    }
  });

  watchers.set(watchKey, { watcher, debounceTimer: null });
}

/**
 * Handle file change event
 */
function handleFileChange(filename: string): void {
  if (!activeWorkspacePath) return;

  const filePath = path.join(activeWorkspacePath, EXCO_FOLDER_NAME, filename);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(`Failed to read governance file ${filename}:`, err);
      return;
    }

    // Update database
    setGovernanceFile(activeWorkspacePath!, filename, content);

    // Notify renderer
    sendToRenderer('governance:changed', { filename, content });
  });
}

/**
 * Write governance file (from renderer to filesystem and database)
 */
export async function writeGovernanceFile(filename: string, content: string): Promise<void> {
  if (!activeWorkspacePath) {
    throw new Error('No active workspace');
  }

  const excoPath = path.join(activeWorkspacePath, EXCO_FOLDER_NAME);
  const filePath = path.join(excoPath, filename);

  // Ensure directory exists
  if (!fs.existsSync(excoPath)) {
    fs.mkdirSync(excoPath, { recursive: true });
  }

  // Atomic write: write to temp file then rename
  const tempPath = filePath + '.tmp';
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, filePath);

  // Update database
  setGovernanceFile(activeWorkspacePath, filename, content);

  // Notify renderer
  sendToRenderer('governance:changed', { filename, content });
}

/**
 * Read governance file (from database or filesystem)
 */
export function readGovernanceFile(filename: string): string {
  if (!activeWorkspacePath) return '';

  // Try database first
  const dbContent = getGovernanceFile(activeWorkspacePath, filename);
  if (dbContent) return dbContent;

  // Fallback to filesystem
  const filePath = path.join(activeWorkspacePath, EXCO_FOLDER_NAME, filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Get all governance files for current workspace
 */
export function getAllGovernanceFiles(): Record<string, string> {
  if (!activeWorkspacePath) return {};

  const result: Record<string, string> = {};
  for (const filename of GOVERNANCE_FILES) {
    result[filename] = readGovernanceFile(filename);
  }
  return result;
}

/**
 * Stop watching all governance files
 */
export function stopGovernanceWatcher(): void {
  for (const [, entry] of watchers) {
    entry.watcher.close();
    if (entry.debounceTimer) {
      clearTimeout(entry.debounceTimer);
    }
  }
  watchers.clear();
  activeWorkspacePath = null;
}

/**
 * Get active workspace path
 */
export function getActiveWorkspacePath(): string | null {
  return activeWorkspacePath;
}

/**
 * Set active workspace path
 */
export function setActiveWorkspacePath(path: string | null): void {
  activeWorkspacePath = path;
}