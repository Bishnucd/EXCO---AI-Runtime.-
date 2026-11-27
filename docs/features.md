---
name: features
description: Feature inventory for EXCO application organized by module and functional area
type: project
---

# EXCO Feature Inventory

Status indicators: `[ ]` Pending | `[-]` In Progress | `[x]` Completed and Verified

---

## 1. Application Core

### 1.1 Electron Application Shell
- `[x]` Main process initialization and lifecycle management
- `[x]` BrowserWindow creation with security hardening
- `[x]` IPC channel registration and type-safe communication
- `[x]` Application menu (native menus per platform)
- `[x]` Auto-updater integration (electron-updater)
- `[x]` Crash reporting and error boundary
- `[x]` Single instance lock
- `[ ]` Protocol handlers for deep linking

### 1.2 Renderer Process (React + Vite)
- `[x]` Vite configuration for Electron renderer
- `[x]` React 18+ with TypeScript strict mode
- `[x]` React Router for SPA navigation
- `[x]` Error boundaries for graceful degradation
- `[x]` Hot module replacement in development
- `[ ]` Production build optimization

### 1.3 Preload Scripts (Secure Bridge)
- `[x]` Context isolation enabled
- `[x]` Typed IPC channel exposure via contextBridge
- `[x]` Schema validation for all IPC messages
- `[x]` Secure API surface (no Node.js globals in renderer)

### 1.4 Shared Types & Utilities
- `[x]` TypeScript types for IPC channels
- `[x]` Zod schemas for runtime validation
- `[x]` Shared constants and enums
- `[x]` Utility functions (clsx, date formatting, etc.)

---

## 2. Chatbot Mode

### 2.1 Conversation Management
- `[x]` Conversation list sidebar with search/filter
- `[x]` Create new conversation
- `[x]` Rename conversation (inline edit)
- `[x]` Archive conversation (soft delete)
- `[ ]` Restore archived conversations
- `[x]` Permanent delete with confirmation
- `[x]` Conversation persistence (SQLite)
- `[ ]` Message ordering and pagination

### 2.2 Chat Interface
- `[x]` Message bubbles (user, assistant, system, tool)
- `[x]` Streaming response rendering
- `[x]` Markdown rendering with syntax highlighting
- `[x]` Code block copy button
- `[x]` Message actions (copy, regenerate, delete)
- `[x]` Auto-scroll to bottom on new messages
- `[x]` Keyboard shortcuts (Enter to send, Shift+Enter for newline)

### 2.3 AI Integration
- `[x]` Provider abstraction interface
- `[x]` Anthropic provider implementation
- `[x]` OpenAI provider implementation
- `[ ]` Google Gemini provider implementation
- `[ ]` Ollama/local provider implementation
- `[x]` Model selection dropdown with capabilities
- `[x]` Reasoning/effort level selection
- `[x]` Temperature and token limits
- `[x]` System prompt management
- `[x]` Streaming response handling (Server-Sent Events)
- `[ ]` Tool use / function calling support
- `[ ]` Multimodal input (images, files)
- `[x]` Token usage tracking and display

### 2.4 Attachments
- `[ ]` File upload (drag-drop, paste, button)
- `[ ]` Image preview in chat
- `[ ]` File type validation
- `[ ]` Size limits and progress indication
- `[ ]` Base64 encoding for API transmission

---

## 3. Work Mode

### 3.1 Project Workspace
- `[x]` Folder selection dialog (native OS picker)
- `[x]` Workspace permission level enforcement
- `[x]` Project metadata storage (.exco folder)
- `[x]` Recent projects list
- `[ ]` Workspace switching

### 3.2 File Explorer
- `[x]` Directory tree with expand/collapse
- `[x]` File icons by type (VS Code style)
- `[x]` File operations: create, rename, delete, duplicate
- `[ ]` Drag-and-drop move/copy
- `[x]` Context menu (right-click)
- `[x]` File search/filter
- `[ ]` Git status indicators (optional)
- `[x]` Binary file detection

### 3.3 File Editor
- `[ ]` Monaco Editor or CodeMirror integration (using textarea for now)
- `[x]` Syntax highlighting for major languages
- `[x]` Tabbed interface for multiple files
- `[x]` Unsaved changes indicator
- `[ ]` Auto-save option
- `[ ]` Find/replace in file
- `[ ]` Go to definition (LSP integration - future)

### 3.4 Integrated Terminal
- `[ ]` xterm.js with WebGL addon (basic implementation)
- `[ ]` node-pty for real shell process (mock for now)
- `[x]` Multiple terminal tabs
- `[x]` Shell detection (PowerShell, cmd, bash, zsh)
- `[ ]` Working directory synchronization with file explorer
- `[ ]` Copy/paste support
- `[ ]` Terminal resize handling
- `[ ]` Scrollback buffer
- `[ ]` Command history

### 3.5 Access Control Enforcement
- `[x]` Level 1: Ask Every Time (permission prompts for each action)
- `[x]` Level 2: Selected Folder (autonomous within workspace root)
- `[x]` Level 3: Full Access (broader permissions)
- `[x]` Path traversal protection
- `[ ]` Symbolic link resolution and validation
- `[x]` Destructive operation confirmations
- `[ ]` Audit log of file/terminal operations

### 3.6 Autonomous Engineering Engine (EXCO-Core)
- `[ ]` Codebase reverse-engineering (discovery, flow analysis, dependency analysis)
- `[ ]` Architecture analysis and documentation
- `[ ]` Requirement analysis from user input
- `[ ]` Implementation planning with task breakdown
- `[ ]` Multi-file code generation and modification
- `[ ]` Automated debugging and error resolution
- `[ ]` Test generation and execution
- `[ ]` Build verification
- `[ ]` Security-aware development checks
- `[x]` Five-file governance integration (unsaved, rules, features, update, flow)
- `[ ]` Session continuity via flow.md
- `[ ]` Model handoff support

---

## 4. Sidebar & Navigation

### 4.1 Primary Sidebar
- `[x]` Mode switcher (Chatbot / Work)
- `[x]` Conversation list (Chatbot mode)
- `[x]` File explorer (Work mode)
- `[x]` Collapsible sections
- `[x]` Responsive width (collapsed/expanded)
- `[ ]` Keyboard navigation

### 4.2 Mode Transition Animation
- `[ ]` Smooth animated transition between modes
- `[ ]` Shared layout elements preserve position
- `[ ]` Content cross-fade or slide
- `[ ]` No layout shift during transition

---

## 5. Settings & Configuration

### 5.1 Settings Drawer/Panel
- `[x]` Slide-out settings panel
- `[x]` Tabbed settings categories
- `[x]` Persistent settings (electron-store or SQLite)
- `[ ]` Import/export settings

### 5.2 Theme Management
- `[x]` Light / Dark / System theme
- `[x]` CSS custom properties for theming
- `[x]` Tailwind dark mode integration
- `[x]` Theme persistence
- `[ ]` Custom accent color (optional)

### 5.3 Model Registry
- `[x]` Provider configuration UI
- `[x]` API key management (secure vault)
- `[x]` Model listing with capabilities
- `[x]` Default model selection
- `[x]` Connection testing

### 5.4 API Key Vault
- `[x]` Encrypted storage (Node.js crypto + OS keychain where available)
- `[x]` Per-provider key management
- `[x]` Key validation on save
- `[x]` Masked display
- `[x]` Delete/rotate keys

### 5.5 MCP Server Management
- `[x]` Add/remove MCP servers
- `[x]` Server configuration (command, args, env)
- `[ ]` Connection status monitoring
- `[x]` Tool discovery and listing
- `[ ]` Tool execution from chat/work mode
- `[ ]` Permission controls per server

### 5.6 Plugin Management
- `[ ]` Plugin discovery (local/plugins directory)
- `[ ]` Enable/disable plugins
- `[ ]` Plugin settings
- `[ ]` Skill registration from plugins

### 5.7 Access Permissions
- `[x]` Global permission level selector
- `[x]` Per-workspace permission override
- `[ ]` Permission audit log viewer

### 5.8 Application Preferences
- `[x]` Language/locale
- `[x]` Auto-save interval
- `[x]` Font size and family (editor/terminal)
- `[x]` Startup behavior
- `[x]` Telemetry opt-in/out

---

## 6. AI Provider Infrastructure

### 6.1 Provider Abstraction Layer
- `[x]` Unified interface: `sendMessage`, `streamMessage`, `listModels`, `validateConnection`
- `[x]` Capability detection per model
- `[x]` Provider factory/registry
- `[x]` Error normalization across providers

### 6.2 Provider Implementations
- `[x]` Anthropic (Claude) - Messages API, streaming, tool use
- `[x]` OpenAI - Chat Completions, streaming, function calling
- `[ ]` Google Gemini - GenerateContent, streaming, function calling
- `[ ]` Ollama - Local models, streaming
- `[ ]` OpenRouter / custom endpoints (extensible)

### 6.3 Streaming & Real-time
- `[x]` Server-Sent Events handling
- `[x]` Chunked response parsing
- `[ ]` Tool call streaming
- `[x]` Abort/cancel in-flight requests

---

## 7. Data Persistence

### 7.1 SQLite Database
- `[x]` Database initialization and migrations
- `[x]` Conversations table
- `[x]` Messages table (with streaming chunks)
- `[x]` Workspaces table
- `[x]` Settings table
- `[x]` API keys table (encrypted)
- `[x]` MCP servers table

### 7.2 File-based Governance
- `[x]` File watchers for .md governance files
- `[x]` Automatic sync between UI state and files
- `[ ]` Conflict resolution for concurrent edits

---

## 8. Testing & Quality

### 8.1 Unit Tests
- `[x]` Vitest configuration
- `[x]` Shared logic tests (utils, schemas, types)
- `[ ]` Provider abstraction tests
- `[ ]` Permission logic tests
- `[ ]` Database operation tests

### 8.2 Integration Tests
- `[ ]` IPC communication tests
- `[ ]` Database integration tests
- `[ ]` File system operation tests
- `[ ]` Terminal process tests

### 8.3 End-to-End Tests
- `[x]` Playwright configuration for Electron
- `[ ]` Chatbot mode workflow tests
- `[ ]` Work mode workflow tests
- `[ ]` Settings persistence tests
- `[ ]` Theme switching tests

### 8.4 Build Verification
- `[ ]` TypeScript compilation check
- `[ ]` ESLint + Prettier check
- `[ ]` Production build success
- `[ ]` electron-builder packaging test

---

## 9. Security & Hardening

### 9.1 Electron Security
- `[x]` Context isolation: true
- `[x]` Node integration: false (renderer)
- `[x]` Sandbox: true (where compatible)
- `[ ]` CSP headers
- `[x]` Preload script validation
- `[x]` IPC schema validation

### 9.2 Credential Security
- `[x]` AES-256-GCM encryption for vault
- `[x]` OS keychain integration (keytar)
- `[x]` Memory-only decryption
- `[x]` Secure erase on delete

### 9.3 File System Security
- `[x]` Path normalization and validation
- `[x]` Workspace root enforcement
- `[ ]` Symlink attack prevention
- `[x]` Permission checks before operations

---

## 10. Desktop Packaging

### 10.1 electron-builder Configuration
- `[x]` Windows (NSIS + portable)
- `[x]` macOS (DMZ + universal)
- `[x]` Linux (AppImage + deb + rpm)
- `[ ]` Code signing configuration
- `[ ]` Auto-update manifest

### 10.2 Distribution
- `[ ]` GitHub Actions CI/CD pipeline
- `[ ]` Release automation
- `[ ]` Checksums and signatures
- `[ ]` Installer testing

---

## Implementation Priority Order

1. **Foundation** (Application Core: 1.1-1.4)
2. **UI Shell** (Sidebar, Navigation, Theme: 4.1-4.2, 5.2)
3. **Chatbot Mode** (2.1-2.4) - core value proposition
4. **Settings & AI Providers** (5.1, 5.3-5.4, 6.1-6.3)
5. **Work Mode** (3.1-3.5) - file explorer, terminal, permissions
6. **Governance & Autonomous Engine** (3.6, 7.2)
7. **MCP & Plugins** (5.5-5.6, 8.2)
8. **Testing & Hardening** (8.1-8.4, 9.1-9.3)
9. **Packaging** (10.1-10.2)