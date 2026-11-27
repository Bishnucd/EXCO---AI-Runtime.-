---
name: document-batch-pipeline
description: Converts, extracts, renames, and archives a folder of documents in a repeatable batch job with a dry run, a manifest, and per-file error isolation. Use when processing dozens or thousands of PDFs, images, invoices, or scans, or when a one-off conversion script needs to become rerunnable.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# Document Batch Pipeline

A batch job that can be run twice safely, reports exactly what it did, and does not lose the
originals.

## When to use

- Converting a folder of documents between formats.
- Extracting text, tables, or metadata from many files.
- Renaming or filing documents by content.
- Re-running a conversion after fixing one bad file.

## Workflow

### 1. Inventory before touching anything

Produce a manifest of inputs: path, size, type (by content, not extension), page count where
relevant, and a SHA-256 hash. Report the count and total size. Stop if the count is zero or if
the folder contains unexpected file types beyond a stated threshold.

### 2. Define the transformation precisely

Write the contract before code:

| Aspect | Decision |
|--------|----------|
| Input types accepted | e.g. PDF 1.4+, JPEG, PNG |
| Output naming | e.g. `<source-stem>.txt`, collisions get `-2` |
| Output location | A new directory, never the input directory |
| Encoding | UTF-8, LF line endings |
| Metadata to preserve | Original path, hash, source mtime |
| Failure policy | Isolate, log, continue; never abort the whole batch |

### 3. Dry run first

`--dry-run` prints the planned operation per file and writes `plan.json`. No writes occur.
Show the first 20 lines and the total counts. Require confirmation for destructive operations
(overwrite, delete, move).

### 4. Execute with isolation

- Process one file at a time in a `try`/`catch`; one failure must not stop the batch.
- Write outputs atomically: write to a temp file, then rename.
- Record per-file status in `manifest.json`: `ok`, `skipped`, `failed` with a reason.
- Log progress every N files with counts, not per-file spam.
- Enforce a timeout per file; a hung OCR call should not stall the job.

### 5. Verify

- Output count equals successful input count.
- Spot-check 3 files by opening the output, not just by checking size.
- Re-run on the same input: results must be identical (idempotent), and the manifest should
  report `skipped: already processed` using hashes.
- Check for zero-byte outputs and flag them as failures, not successes.

### 6. Summarise

```
Processed 1,284 files in 6m 12s
  ok        1,271
  skipped       9  (unchanged hash)
  failed        4
Failures:
  invoices/scan_0442.pdf  – encrypted, password required
  ...
```

### 7. Make it rerunnable

- Keep the manifest; it is the resume state.
- `--resume` skips files already marked `ok` with a matching hash.
- Version the script; note the version in the manifest.

## Rules

- Never modify or delete inputs. Outputs go to a separate directory.
- Never process files outside the stated input directory, including via symlinks that escape it.
- Never send document contents to a third-party service without explicit permission.
- Never report a file as converted without verifying the output is readable.
- Do not silently drop unreadable files; they must appear in the failure list.

## Output format

```
out/
├── <converted files>
├── manifest.json
└── summary.txt
```

`manifest.json` per entry: `{ input, sha256, bytes, status, output, error, duration_ms }`.

## Error handling

| Condition | Action |
|-----------|--------|
| Encrypted or password-protected file | Mark `failed: encrypted`, continue |
| Corrupt file | Mark `failed: unreadable`, continue, keep the original |
| Disk full | Abort cleanly, keep the manifest, report the last completed file |
| Filename collision | Append `-2`, `-3`; record the mapping |
| Very large batch (>50k) | Chunk by directory, report progress per chunk |

## Example

**Input:** 1,284 scanned invoices, target: searchable PDF plus extracted text.
**Output:** `out/`, `manifest.json` with 1,271 ok / 9 skipped / 4 failed, `summary.txt`, and a
`--resume` run that completes in 40 seconds by skipping unchanged inputs.
