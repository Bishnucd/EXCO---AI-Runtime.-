---
name: pptx-slide-deck-programmatic-generation
description: Generates branded PowerPoint PPTX presentation decks with dynamic charts, tables, and shapes using python-pptx. Use when automating recurring executive slide decks and reporting presentations.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://python-pptx.readthedocs.io/"
---
# Pptx Slide Deck Programmatic Generation

## Overview
Manually updating weekly executive slide decks wastes hours. Scripting PowerPoint generation from master slide layouts populates charts, tables, and text boxes directly from SQL metrics.

## Operational Workflow

1. **Load master corporate PPTX template preserving branded slide masters, color palettes, and fonts.**:
   - Load master corporate PPTX template preserving branded slide masters, color palettes, and fonts.

2. **Select slide layout types (title, content, comparison) and instantiate new slide objects.**:
   - Select slide layout types (title, content, comparison) and instantiate new slide objects.

3. **Populate text placeholders, format bullet hierarchies, and add styled data tables.**:
   - Populate text placeholders, format bullet hierarchies, and add styled data tables.

4. **Insert native PowerPoint chart objects (bar, line) populated with current query data arrays.**:
   - Insert native PowerPoint chart objects (bar, line) populated with current query data arrays.

## Recommended Tools & Environments
- python-pptx
- Office Open XML
- Python 3.10+
- PowerPoint

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
