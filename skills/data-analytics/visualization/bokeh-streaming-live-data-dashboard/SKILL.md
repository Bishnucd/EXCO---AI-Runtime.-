---
name: bokeh-streaming-live-data-dashboard
description: Streams real-time streaming time-series data to browser canvases using Python Bokeh Server. Use when monitoring live industrial sensors, financial order books, and streaming metrics.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.bokeh.org/en/latest/docs/user_guide/server.html"
---
# Bokeh Streaming Live Data Dashboard

## Overview
Bokeh Server synchronizes Python data models directly with browser client JavaScript via WebSockets, allowing real-time append streaming to live figures without page reloads.

## Operational Workflow

1. **Initialize Bokeh ColumnDataSource with initial time-series coordinate arrays.**:
   - Initialize Bokeh ColumnDataSource with initial time-series coordinate arrays.

2. **Define periodic callback function (add_periodic_callback) to query streaming data sources.**:
   - Define periodic callback function (add_periodic_callback) to query streaming data sources.

3. **Stream newly arrived batch points to ColumnDataSource via stream() method with rollover buffer.**:
   - Stream newly arrived batch points to ColumnDataSource via stream() method with rollover buffer.

4. **Run Bokeh server application exposing live WebSocket endpoint to connected browsers.**:
   - Run Bokeh server application exposing live WebSocket endpoint to connected browsers.

## Recommended Tools & Environments
- Bokeh
- WebSockets
- Python
- Real-Time Streaming

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
