---
name: next-image-modern-avif-optimization
description: Optimizes responsive image delivery with automated AVIF/WebP generation using next/image. Use when achieving 100% Core Web Vitals Largest Contentful Paint (LCP) scores.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nextjs.org/docs/app/api-reference/components/image"
---
# Next Image Modern Avif Optimization

## Overview
Unoptimized hero images crush Core Web Vitals. The Next.js Image component automatically resizes images, converts to AVIF/WebP, prevents cumulative layout shift (CLS), and lazily loads off-screen images.

## Operational Workflow

1. **Enable AVIF image format support in next.config.js**:
   - Enable AVIF image format support in next.config.js: images: { formats: ["image/avif", "image/webp"] }.

2. **Render hero image using <Image src={heroImg} alt="Hero" priority placeholder="blur" />.**:
   - Render hero image using <Image src={heroImg} alt="Hero" priority placeholder="blur" />.

3. **Specify responsive sizes attribute (e.g., sizes="(max-width**:
   - Specify responsive sizes attribute (e.g., sizes="(max-width: 768px) 100vw, 50vw") to serve matched device widths.

4. **Verify that Largest Contentful Paint loads in under 1.5 seconds on mobile 4G networks.**:
   - Verify that Largest Contentful Paint loads in under 1.5 seconds on mobile 4G networks.

## Recommended Tools & Environments
- next/image
- AVIF / WebP
- Responsive Images
- LCP Optimization

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
