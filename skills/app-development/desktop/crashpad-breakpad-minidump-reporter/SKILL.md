---
name: crashpad-breakpad-minidump-reporter
description: Configures Crashpad and Breakpad to capture C++ native process crashes and transmit minidump files to telemetry servers. Use when diagnosing native desktop crashes in production.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://chromium.googlesource.com/crashpad/crashpad/+/master/doc/overview.md"
---
# Crashpad Breakpad Minidump Reporter

## Overview
Uncaught native memory faults and segfaults kill processes instantly without emitting JavaScript stack traces. Crashpad captures memory state and register minidumps for offline post-mortem debugging.

## Operational Workflow

1. **Initialize Crashpad handler executable during application bootstrapping.**:
   - Initialize Crashpad handler executable during application bootstrapping.

2. **Configure minidump upload endpoints pointing to crash reporting backends (Sentry, Backtrace).**:
   - Configure minidump upload endpoints pointing to crash reporting backends (Sentry, Backtrace).

3. **Attach application metadata (app version, OS build, user ID, breadcrumb logs) to crash reports.**:
   - Attach application metadata (app version, OS build, user ID, breadcrumb logs) to crash reports.

4. **Symbolicate minidump stack traces using dSYM (macOS) and PDB (Windows) debug symbol tables.**:
   - Symbolicate minidump stack traces using dSYM (macOS) and PDB (Windows) debug symbol tables.

## Recommended Tools & Environments
- Crashpad
- Google Breakpad
- C++ / Electron
- Sentry / Backtrace

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
