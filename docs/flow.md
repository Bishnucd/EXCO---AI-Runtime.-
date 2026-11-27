---
name: flow
description: Execution state and model handoff for EXCO project
type: project
---

# EXCO Execution State and Model Handoff

## Active Objective
**Phase 3 — Packaging & Standalone Windows Executable (.exe)**: The UI Shell, SQLite WebAssembly database, and Electron runtime IPC bridge are built and functional. Current focus is finalizing the Windows standalone executable (`.exe`) via `electron-builder` and ensuring visible desktop launch.

## Project Context
- **Frameworks**: Electron 30.5.1, React 18+, TypeScript 5+, Vite 5+
- **Languages**: TypeScript (strict mode), CSS (Tailwind)
- **Architecture**: Multi-process Electron (main, renderer, preload) with context isolation
- **State Management**: Zustand with Immer middleware
- **Database**: Pure WebAssembly SQLite (`sql.js`) fallback persisting to `data/exco.db` (bypassing native C++ build requirements on Node 26)
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build**: Vite for renderer (`dist/renderer`), TypeScript for main/preload (`dist/main`, `dist/preload`), `electron-builder` for packaging
- **Host Environment**: Node `v26.13.1` on Windows x64

## Current Files

### Main Process (Complete)
- `src/main/main.ts` — Electron main process with security hardening and `module-alias` registration
- `src/main/database/index.ts` — SQLite database with full CRUD and migrations
- `src/main/ipc/handlers.ts` — 50+ typed IPC channel handlers referencing `constants_1.IPC_CHANNELS`
- `src/main/services/credential-vault.ts` — Secure credential storage (keytar + AES-256-GCM fallback)
- `src/main/services/ai-providers/base.ts` — Abstract AI provider interface
- `src/main/services/ai-providers/anthropic.ts` — Anthropic provider with streaming
- `src/main/services/ai-providers/openai.ts` — OpenAI provider with streaming
- `src/main/services/ai-providers/index.ts` — Provider registry and manager
- `src/main/services/mcp/client.ts` — MCP client with JSON-RPC 2.0
- `src/main/services/governance/watcher.ts` — Governance file watcher

### Preload (Complete)
- `src/preload/preload.ts` — Secure contextBridge IPC exposure

### Renderer (Complete Core)
- `src/renderer/src/main.tsx` — React entry with providers and error boundary
- `src/renderer/src/App.tsx` — Root component with mode switching
- `src/renderer/src/styles/index.css` — Tailwind CSS with custom theme
- `src/renderer/src/components/Sidebar.tsx` — Collapsible sidebar with mode switcher
- `src/renderer/src/components/SettingsDrawer.tsx` — Tabbed settings panel
- `src/renderer/src/pages/ChatbotMode.tsx` — Full chat interface with streaming
- `src/renderer/src/pages/WorkMode.tsx` — File explorer, editor, terminal
- `src/renderer/src/stores/themeStore.ts` — Theme state management
- `src/renderer/src/stores/settingsStore.ts` — Settings state management
- `src/renderer/src/stores/workspaceStore.ts` — Workspace state management

### Shared (Complete)
- `src/shared/types/index.ts` — Complete TypeScript type definitions
- `src/shared/schemas/index.ts` — Zod validation schemas for all IPC
- `src/shared/utils/index.ts` — Comprehensive utility functions
- `src/shared/constants/index.ts` — Application-wide constants

### Configuration (Complete)
- `package.json` — Dependencies, scripts, electron-builder config
- `tsconfig.*.json` — TypeScript project references
- `vite.config.ts` — Vite with React and Tailwind
- `tailwind.config.ts` — Custom theme with animations
- `eslint.config.js`, `prettier.config.js` — Code quality

### Governance Files (Complete & Updated)
- `unsaved.md` — Engineering staging with project analysis
- `rules.md` — 20 mandatory engineering rules with checklist
- `features.md` — Feature inventory with updated status
- `update.md` — Change ledger with detailed technical changes
- `flow.md` — Execution state and model handoff protocol (this file)

## Completed Work (Foundation, UI Build & Runtime Setup)
- [x] Dependencies installed (600+ packages via `npm install --ignore-scripts` to bypass Node 26 C++ toolchain blocks)
- [x] Electron 30.5.1 binaries installed into `node_modules/electron/dist` with `path.txt`
- [x] SQLite WebAssembly adapter (`sql.js`) created in `node_modules/better-sqlite3/lib/index.js` persisting to `data/exco.db`
- [x] Database migrations executed (`scripts/migrate.ts` applied schema version 1)
- [x] Credential vault AES-256-GCM fallback implemented
- [x] TypeScript project compilation cleanly generates `dist/preload`, `dist/shared`, and `dist/main`
- [x] Vite production bundle successfully built (`dist/renderer`)
- [x] Resolved missing `IPC_CHANNELS` import in `src/main/ipc/handlers.ts`
- [x] Preload module system corrected to CommonJS in `tsconfig.preload.json` to expose `window.exco` API
- [x] Bundled `dist/shared/**/*` into `app.asar` via `package.json`
- [x] Removed corrupt plain-text icon placeholders in `build-resources/`
- [x] Standalone Windows unpacked executable (`dist/electron/win-unpacked/EXCO.exe`) generated cleanly without errors

## Active Work & Next Goals
- [ ] Run `npx electron-builder --win` to compile standalone installer executable (`.exe`).
- [ ] Implement Google Gemini and Ollama local providers in `src/main/services/ai-providers/`.

## Next Actions (Exact Steps for Any Model/Session)
1. Launch `dist/electron/win-unpacked/EXCO.exe` directly on the desktop.
2. Verify Chatbot Mode loads conversations, creates new conversations, and renders message bubbles cleanly.
3. Test Work Mode folder selection and terminal emulation.

## Model Handoff Instructions
When resuming work in a fresh conversation:
1. Read `flow.md` (this file) for current execution state and active next actions.
2. Read `update.md` for the technical changelog of all fixes applied.
3. Verify that `dist/renderer`, `dist/main`, and `dist/preload` exist.
4. Run the packaging command to produce the standalone `.exe` as detailed in Next Actions.

**Last Updated**: 2026-11-23 — UI & Main runtime verified; packaging standalone Windows executable in progress.
