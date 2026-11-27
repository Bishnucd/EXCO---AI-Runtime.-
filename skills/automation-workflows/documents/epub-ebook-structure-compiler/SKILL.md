---
name: epub-ebook-structure-compiler
description: Compiles clean HTML/Markdown chapters, CSS styles, and metadata into validated EPUB 3 digital publication ebooks. Use when automating eBook generation and digital publishing pipelines.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://www.w3.org/publishing/epub3/epub-overview.html"
---
# Epub Ebook Structure Compiler

## Overview
EPUB 3 is the open standard for reflowable digital books. Compiling structured HTML chapters with spine manifests, navigation documents (toc.xhtml), and Dublin Core metadata ensures compatibility.

## Operational Workflow

1. **Structure package directory with mimetype, META-INF/container.xml, and content files.**:
   - Structure package directory with mimetype, META-INF/container.xml, and content files.

2. **Compile chapter Markdown into clean XHTML documents with semantic typography tags.**:
   - Compile chapter Markdown into clean XHTML documents with semantic typography tags.

3. **Author package.opf manifest enumerating all text, font, image, and spine reading order assets.**:
   - Author package.opf manifest enumerating all text, font, image, and spine reading order assets.

4. **Package uncompressed into .epub zip archive and validate against IDPF epubcheck.**:
   - Package uncompressed into .epub zip archive and validate against IDPF epubcheck.

## Recommended Tools & Environments
- EPUB 3
- epubcheck
- Python ebooklib / Pandoc
- ZIP

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
