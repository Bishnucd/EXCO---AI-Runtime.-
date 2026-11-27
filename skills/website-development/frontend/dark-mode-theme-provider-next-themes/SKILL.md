---
name: dark-mode-theme-provider-next-themes
description: Implements zero-flash light, dark, and system theme switching using next-themes and CSS variables. Use when delivering flicker-free theme switching across React and Next.js applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/pacocoursey/next-themes"
---
# Dark Mode Theme Provider Next Themes

## Overview
Naive theme implementations flash a white screen when reloading in dark mode. next-themes injects a tiny synchronous script before DOM hydration, ensuring immediate correct theme application.

## Operational Workflow

1. **Wrap application layout with <ThemeProvider attribute="class" defaultTheme="system" enableSystem>.**:
   - Wrap application layout with <ThemeProvider attribute="class" defaultTheme="system" enableSystem>.

2. **Define CSS custom property color tokens under **:
   - Define CSS custom property color tokens under :root and .dark classes in global stylesheet.

3. **Create theme toggle button using useTheme() hook**:
   - Create theme toggle button using useTheme() hook: const { theme, setTheme } = useTheme().

4. **Verify zero flash of unstyled content (FOUC) when reloading page in dark mode.**:
   - Verify zero flash of unstyled content (FOUC) when reloading page in dark mode.

## Recommended Tools & Environments
- next-themes
- Dark Mode
- Zero-Flash (FOUC)
- CSS Variables

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
