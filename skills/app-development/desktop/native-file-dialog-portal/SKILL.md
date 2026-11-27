---
name: native-file-dialog-portal
description: Integrates native OS file pickers, folder dialogs, and save prompts via XDG Desktop Portals and native APIs. Use when providing native, sandboxed file selection in desktop applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://flatpak.github.io/xdg-desktop-portal/"
---
# Native File Dialog Portal

## Overview
Sandboxed applications cannot directly read arbitrary host filesystems. Invoking native desktop portals renders familiar OS file dialogs while safely granting access only to chosen files.

## Operational Workflow

1. **Detect host operating system environment and active sandbox constraints (Flatpak, Snap, AppContainer).**:
   - Detect host operating system environment and active sandbox constraints (Flatpak, Snap, AppContainer).

2. **Invoke native file picker (NSOpenPanel on macOS, IFileDialog on Windows, org.freedesktop.portal.FileChooser on Linux).**:
   - Invoke native file picker (NSOpenPanel on macOS, IFileDialog on Windows, org.freedesktop.portal.FileChooser on Linux).

3. **Configure file extension filters and multi-selection permissions.**:
   - Configure file extension filters and multi-selection permissions.

4. **Receive authorized file descriptors or canonical file path handles from the portal response.**:
   - Receive authorized file descriptors or canonical file path handles from the portal response.

## Recommended Tools & Environments
- XDG Desktop Portal
- Win32 IFileDialog
- macOS NSOpenPanel
- Rust / C++

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
