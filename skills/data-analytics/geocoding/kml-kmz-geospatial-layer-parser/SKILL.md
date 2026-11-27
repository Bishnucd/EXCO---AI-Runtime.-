---
name: kml-kmz-geospatial-layer-parser
description: Extracts placemarks, polygons, styling, and embedded ground overlays from Google Earth KML and KMZ files. Use when ingesting Google Earth spatial layers into modern GIS systems.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://developers.google.com/kml/documentation"
---
# Kml Kmz Geospatial Layer Parser

## Overview
Field teams frequently share spatial data in Google Earth KML/KMZ formats. Unzipping KMZ bundles and parsing KML XML translates placemarks, line strings, and extended data into standard GeoJSON.

## Operational Workflow

1. **Unzip .kmz compressed archives to extract doc.kml and associated icon/overlay images.**:
   - Unzip .kmz compressed archives to extract doc.kml and associated icon/overlay images.

2. **Parse KML XML structure extracting Document, Folder, and Placemark nodes.**:
   - Parse KML XML structure extracting Document, Folder, and Placemark nodes.

3. **Extract Geometry elements (Point, LineString, Polygon) and convert coordinates to WGS84.**:
   - Extract Geometry elements (Point, LineString, Polygon) and convert coordinates to WGS84.

4. **Capture ExtendedData schema attributes and export unified GeoJSON FeatureCollection.**:
   - Capture ExtendedData schema attributes and export unified GeoJSON FeatureCollection.

## Recommended Tools & Environments
- fastkml / pykml
- XML / ZIP
- GeoJSON
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
