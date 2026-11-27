---
name: turn-by-turn-navigation-formatter
description: Parses road geometry and routing graph maneuvers into human-readable turn-by-turn navigational directions. Use when formatting GPS routing itineraries for mobile drivers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://project-osrm.org/docs/v5.24.0/api/"
---
# Turn By Turn Navigation Formatter

## Overview
Raw routing paths are polyline coordinate arrays. Turning them into navigation prompts requires mapping bearing changes to turn maneuvers (slight right, sharp left), street names, and voice cues.

## Operational Workflow

1. **Extract maneuver types, bearing angles, and road name attributes from routing graph legs.**:
   - Extract maneuver types, bearing angles, and road name attributes from routing graph legs.

2. **Synthesize human-friendly instruction text (e.g., In 400 meters, turn left onto Main Street).**:
   - Synthesize human-friendly instruction text (e.g., In 400 meters, turn left onto Main Street).

3. **Format distance and duration values into localized units (miles/km, minutes).**:
   - Format distance and duration values into localized units (miles/km, minutes).

4. **Generate step-by-step navigation instructions suitable for audio text-to-speech synthesis.**:
   - Generate step-by-step navigation instructions suitable for audio text-to-speech synthesis.

## Recommended Tools & Environments
- OSRM
- Valhalla
- JSON
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
