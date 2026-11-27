---
name: shiki-syntax-highlighting-code-block
description: Renders syntax-highlighted code blocks at build time with TextMate grammars using Shiki. Use when generating beautiful, lightweight code snippets with zero client-side JavaScript.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://shiki.style/"
---
# Shiki Syntax Highlighting Code Block

## Overview
Client-side highlighters (Prism.js) cause layout shifts and waste browser CPU. Shiki runs at build time, using identical TextMate grammars as VS Code to output static HTML with zero client JS.

## Operational Workflow

1. **Initialize Shiki highlighter specifying desired themes (e.g., github-dark, vites) and languages.**:
   - Initialize Shiki highlighter specifying desired themes (e.g., github-dark, vites) and languages.

2. **Call codeToHtml(code, { lang**:
   - Call codeToHtml(code, { lang: "typescript", theme: "github-dark" }) during markdown compilation.

3. **Support multi-theme switching using dual CSS variables without duplicate HTML markup.**:
   - Support multi-theme switching using dual CSS variables without duplicate HTML markup.

4. **Render generated HTML directly into static page output with perfect VS Code syntax fidelity.**:
   - Render generated HTML directly into static page output with perfect VS Code syntax fidelity.

## Recommended Tools & Environments
- Shiki
- TextMate Grammars
- Syntax Highlighting
- Static Site Generation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
