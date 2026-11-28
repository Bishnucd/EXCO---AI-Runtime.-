# EXCO Changelog & Release Notes

## v0.1.2
### Clean Architecture, Dynamic Voices & Workflow UX
- **Manual Workflow Selection & High-Contrast Startup Prompt**: Enforced Turbo / Standard / Deep Thought manual selection on every app reopen, unified 0–100 Overview scoring, same-model cross-API-key quota failover, and fixed dark/light theme contrast on the startup prompt and mode tabs.
- **Clean Workspace Architecture (`workspace-organizer`)**: Automatically organizes newly generated secondary configs, markdown docs, datasets, and downloaded assets into structured folders (`config/`, `docs/`, `data/`, `assets/`) with consistent formatting across all models.
- **Dynamic API Voice Extraction & ElevenLabs Modules**: Extracts voices from ElevenLabs, Gemini, OpenAI, and custom TTS keys inside Settings → Voice and Live Voice Calibration, with external browser sign-in linking and Edge Neural fallback.
- **Recycle Bin Deletion & Multi-Select Explorer**: Moves deleted workspace files/folders to the OS Recycle Bin, adds hover multi-select checkboxes for bulk deletion, and automatically prunes missing folders.

## v0.1.1
### Auto-Update Release
- **Live Voice Chat & Edge Neural Voices**: Continuous two-way voice chat with instant bundled neural voice previews (`Ava` & `Andrew`), single-channel playback locking, adaptive VAD with echo/hallucination guards, and collapsible Voice Transcript cards.
- **Chatbot Mode & Isolated Work Mode**: Strict Chat vs. Work conversation isolation, per-project folder chat history dropdowns, and cross-project chat switching.
- **Smart Tiered Model Router & Silent Failover**: Strict Tier 1 (`Leading`) → Tier 2 → Tier 3 prioritization, real-time Gemini SSE streaming, universal custom-endpoint model extraction, and automatic background failover on auth/billing/rate errors across Chat, Voice, and Work agents.
- **Fast Key Management, External Links & Hardened Security**: Inline API key validation status, instant key deletion & **Clean Invalid** bulk removal, OS external-browser link opening, HTML/XSS & command-sandbox hardening, and verified SQLite SQL-injection & security test coverage.

## v0.1.0
### First Official Public Release (Initial Version)
- **First Ever Official Release (`v0.1.0`)**: Inaugural standalone Windows release (`EXCO-0.1.0-Setup.exe`) with local SQLite storage, OS-backed encrypted API key storage, and built-in GitHub auto-updates targeting `Bishnucd/EXCO`.
- **Live Voice Chat & Edge Neural Voices**: Continuous two-way voice chat with instant bundled neural voice previews (`Ava` & `Andrew`), single-channel playback locking, adaptive VAD with echo/hallucination guards, and collapsible Voice Transcript cards.
- **Chatbot Mode & Isolated Work Mode**: Multi-provider AI workspace with strict Chat vs. Work conversation isolation, per-project folder chat history dropdowns, workspace file tree, multi-tab code editor, integrated PTY terminal, AI Skills registry, and MCP/Plugin integration.
- **Smart Tiered Model Router & Silent Failover**: Strict Tier 1 (`Leading`) → Tier 2 → Tier 3 prioritization, real-time Gemini SSE streaming, universal custom-endpoint model extraction, and automatic background failover on auth/billing/rate errors across Chat, Voice, and Work agents.
- **Fast Key Management, External Links & Hardened Security**: Inline API key validation status, instant key deletion & **Clean Invalid** bulk removal, OS external-browser link opening, HTML/XSS & command-sandbox hardening, and verified SQLite SQL-injection & security test coverage.
- **Curated Wallpapers & Appearance Studio**: High-resolution curated wallpaper collections, custom image validation, global screen filters, and per-segment UI customization.
