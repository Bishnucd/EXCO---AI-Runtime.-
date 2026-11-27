---
name: product-photo-retouch
description: Produces a repeatable retouch workflow for product photography — background cleanup, perspective correction, colour and white-balance normalisation, shadow handling, and export presets — with a before/after check for each step. Use when preparing catalogue images, cleaning supplier photos, or making a product set look consistent.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Product Photo Retouch

Retouching is a fixed sequence of corrections, not an artistic improvisation. The goal is that
the customer sees the product accurately, and that a set of images looks like one set.

## When to use

- Preparing images for a catalogue or marketplace.
- Supplier photos vary in background, white balance, and crop.
- A product set looks inconsistent on the category page.
- Removing a background while keeping a believable shadow.

## Workflow

### 1. Establish the target standard

Record before touching anything:

| Parameter | Value |
|-----------|-------|
| Canvas | square 2000×2000 (or the marketplace's spec) |
| Background | pure white #FFFFFF, or a specified studio grey |
| Subject fill | 80–85% of canvas height, consistent across the set |
| Colour space | sRGB for web; Adobe RGB only if print is the destination |
| Output | JPEG quality 85, or PNG for transparency; max file size |
| Sharpening | applied last, at output size |

The marketplace spec overrides these. Check it rather than assuming.

### 2. Work in a fixed order

1. **Non-destructive setup** — work on a copy, keep the original, use layers or a sidecar.
2. **Lens and perspective** — correct keystoning and distortion first; every later step depends
   on geometry.
3. **Crop and align** — set the subject to the target fill and centre it.
4. **Background removal or cleanup** — mask, refine edges, especially hair, glass, and thin
   straps.
5. **Colour and white balance** — neutralise the light source using a known neutral in the frame.
6. **Exposure and contrast** — match the set, not your taste.
7. **Dust and defect removal** — clone or heal scratches, lint, fingerprints.
8. **Shadow** — add a soft contact shadow if the product floats; keep it subtle.
9. **Export and sharpen** — sharpen at final size, then export to spec.

Do not reorder: sharpening before resizing creates halos, and colour correction after a
background swap fights the new edge.

### 3. Match the set, not the single image

Sample the background value and subject brightness from a reference image in the set. Apply the
same curve and the same canvas fill to every image. A set looks consistent when the background,
the subject scale, and the shadow direction match — not when each image is individually perfect.

### 4. Check for the common failures

| Failure | Check |
|---------|-------|
| Halo around the subject | Zoom to 200% on the edge against a dark and a light background |
| Grey or blue-white background | Sample the corner pixel; it must be 255,255,255 for a white spec |
| Clipped highlights on metal or glass | Inspect the histogram; recover if the source allows |
| Colour cast on white products | Compare against a neutral reference card |
| Over-sharpened edges | Check at 100%; halos are visible as a light fringe |
| Inconsistent shadow direction | Compare across the set |

### 5. Verify at the sizes that matter

- Thumbnail (200px): does the product read clearly?
- Grid (400px): is it the same visual weight as its neighbours?
- Full size: are edges and textures clean?
- Zoom: is there evidence of over-processing?

### 6. Preserve provenance

Keep the original, the retouched master, and a note of what changed. Marketplaces and customers
increasingly require that the product image not misrepresent the item.

## Rules

- Never alter the product's shape, colour, or included accessories. Retouching is correction, not
  fabrication.
- Never remove a defect the customer would receive (scratches on a used item) unless the listing
  states the item is refurbished.
- Never change the background to imply a setting the product is not in.
- Never upscale beyond what the source supports and present it as native resolution.
- Keep the original file; never overwrite it.

## Output format

```
originals/            untouched
masters/              layered or full-quality retouched
exports/              marketplace-ready, named per spec
RETOUCH_LOG.md        per image: steps applied, reference used, export spec
```

## Error handling

| Condition | Action |
|-----------|--------|
| Source resolution below the target canvas | Report the native size; do not upscale silently |
| Background removal fails on glass or mesh | Keep a studio background instead of a bad cutout |
| Product colour cannot be determined | Use a neutral reference card or ask; do not guess |
| Batch of hundreds of images | Apply the same preset, then spot-check 10% and list any outliers |

## Example

**Input:** 40 supplier images, marketplace requires 2000×2000 white background.
**Output:** all 40 on a white canvas at 82% fill, one consistent contact shadow, sRGB JPEG at
quality 85, a log of the six images that needed manual masking, and two flagged as below native
resolution.
