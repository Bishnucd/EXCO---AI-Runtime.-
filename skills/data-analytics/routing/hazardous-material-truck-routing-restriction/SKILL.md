---
name: hazardous-material-truck-routing-restriction
description: Calculates compliant heavy commercial vehicle routes respecting bridge clearances, weight limits, and hazmat tunnels. Use when routing freight trucks and dangerous goods cargo.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/valhalla/valhalla/blob/master/docs/truck_routing.md"
---
# Hazardous Material Truck Routing Restriction

## Overview
Commercial trucks cannot use residential streets or tunnels when hauling flammable goods. Commercial routing checks vehicle height, axle weight, and hazmat classes against road restrictions.

## Operational Workflow

1. **Specify commercial vehicle parameters**:
   - Specify commercial vehicle parameters: height, width, total weight, axle count, and hazmat class.

2. **Filter road graph edges to exclude roads with maxheight, maxweight, or hazmat=no OSM tags.**:
   - Filter road graph edges to exclude roads with maxheight, maxweight, or hazmat=no OSM tags.

3. **Compute optimal legal freight route avoiding low-clearance bridges and restricted tunnels.**:
   - Compute optimal legal freight route avoiding low-clearance bridges and restricted tunnels.

4. **Generate truck-compliant navigation directions with commercial weigh station warnings.**:
   - Generate truck-compliant navigation directions with commercial weigh station warnings.

## Recommended Tools & Environments
- Truck Routing
- Hazmat Restrictions
- Valhalla / GraphHopper
- OSM Tags

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
