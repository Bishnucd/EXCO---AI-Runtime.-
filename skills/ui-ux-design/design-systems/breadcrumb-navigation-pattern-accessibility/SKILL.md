---
name: breadcrumb-navigation-pattern-accessibility
description: Specifies accessible breadcrumb navigation hierarchies with Schema.org BreadcrumbList metadata. Use when structuring secondary navigation and boosting SEO search snippets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/"
---
# Breadcrumb Navigation Pattern Accessibility

## Overview
Breadcrumbs help users understand their location in a site hierarchy. An accessible breadcrumb uses a <nav aria-label="Breadcrumb"> element, ordered lists, and aria-current="page" on the active item.

## Operational Workflow

1. **Wrap breadcrumbs in <nav aria-label="Breadcrumb"> containing an ordered list (<ol>).**:
   - Wrap breadcrumbs in <nav aria-label="Breadcrumb"> containing an ordered list (<ol>).

2. **Mark the final, non-clickable current page item with aria-current="page".**:
   - Mark the final, non-clickable current page item with aria-current="page".

3. **Separate breadcrumb items using CSS pseudo-elements (**:
   - Separate breadcrumb items using CSS pseudo-elements (::after { content: "/" }) to prevent screen reader noise.

4. **Embed Schema.org BreadcrumbList JSON-LD metadata to enable rich breadcrumb snippets in Google Search.**:
   - Embed Schema.org BreadcrumbList JSON-LD metadata to enable rich breadcrumb snippets in Google Search.

## Recommended Tools & Environments
- Breadcrumbs
- WAI-ARIA Pattern
- Schema.org JSON-LD
- Information Architecture

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
