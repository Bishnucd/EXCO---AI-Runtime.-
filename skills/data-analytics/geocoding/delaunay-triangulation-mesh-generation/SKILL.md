---
name: delaunay-triangulation-mesh-generation
description: Generates planar Delaunay triangulations and Triangulated Irregular Networks (TIN) from point coordinate clouds. Use when constructing terrain surface meshes and proximity networks.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.Delaunay.html"
---
# Delaunay Triangulation Mesh Generation

## Overview
Delaunay triangulation connects points into triangles such that no point lies inside the circumcircle of any triangle, avoiding skinny sliver triangles when modeling 3D terrain surfaces.

## Operational Workflow

1. **Collect 2D or 3D coordinate point cloud data.**:
   - Collect 2D or 3D coordinate point cloud data.

2. **Execute scipy.spatial.Delaunay to compute simplex triangle vertex connectivity arrays.**:
   - Execute scipy.spatial.Delaunay to compute simplex triangle vertex connectivity arrays.

3. **Filter out boundary triangles that span outside convex hull boundaries.**:
   - Filter out boundary triangles that span outside convex hull boundaries.

4. **Export 3D Triangulated Irregular Network (TIN) surface mesh in OBJ or GeoJSON format.**:
   - Export 3D Triangulated Irregular Network (TIN) surface mesh in OBJ or GeoJSON format.

## Recommended Tools & Environments
- SciPy spatial.Delaunay
- TIN Meshes
- Shapely
- Computational Geometry

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
