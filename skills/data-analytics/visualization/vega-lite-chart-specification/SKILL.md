---
name: vega-lite-chart-specification
description: Authors declarative, interactive data visualization specifications in Vega-Lite JSON format. Use when creating portable, responsive charts and interactive dashboards for web applications.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://vega.github.io/vega-lite/"
---
# Vega Lite Chart Specification

## Overview
Vega-Lite provides a high-level grammar of interactive graphics. Declarative JSON specs define data sources, mark types (bar, line, point), encodings, and interactive selection filters.

## Operational Workflow

1. **Structure schema-compliant Vega-Lite JSON declaring data url or inline dataset values.**:
   - Structure schema-compliant Vega-Lite JSON declaring data url or inline dataset values.

2. **Map quantitative, temporal, and nominal fields to visual encodings (x, y, color, size).**:
   - Map quantitative, temporal, and nominal fields to visual encodings (x, y, color, size).

3. **Configure interactive selections (interval brush, multi-click) to bind cross-filtering behavior.**:
   - Configure interactive selections (interval brush, multi-click) to bind cross-filtering behavior.

4. **Compile and validate spec against Vega-Lite schema and test rendering in Vega-Embed.**:
   - Compile and validate spec against Vega-Lite schema and test rendering in Vega-Embed.

## Recommended Tools & Environments
- Vega-Lite
- Vega
- JSON
- D3.js

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
