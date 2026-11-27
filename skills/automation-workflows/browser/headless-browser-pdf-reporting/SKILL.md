---
name: headless-browser-pdf-reporting
description: Generates pixel-perfect PDF reports from HTML templates using headless Chromium print-to-PDF APIs. Use when generating automated invoices, certificates, and multi-page documents.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://playwright.dev/docs/api/class-page#page-pdf"
---
# Headless Browser Pdf Reporting

## Overview
Headless Chromium renders complete modern CSS (Grid, Flexbox, Web Fonts) before printing to PDF, providing far superior layout rendering compared to legacy PDF libraries.

## Operational Workflow

1. **Render HTML template with CSS @page rules defining size (A4/Letter) and margins.**:
   - Render HTML template with CSS @page rules defining size (A4/Letter) and margins.

2. **Configure CSS page-break-inside**:
   - Configure CSS page-break-inside: avoid to prevent awkward table row splits.

3. **Execute page.pdf({ printBackground**:
   - Execute page.pdf({ printBackground: true, format: "A4", displayHeaderFooter: true }).

4. **Inject dynamic running headers and footers with page numbers using Chromium template variables.**:
   - Inject dynamic running headers and footers with page numbers using Chromium template variables.

## Recommended Tools & Environments
- Playwright / Puppeteer
- CSS Paged Media
- Chromium
- PDF

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
