---
name: file-upload-s3-presigned-post-policy
description: Generates Amazon S3 presigned POST policies with file size constraints, MIME type checks, and expiration. Use when allowing direct, secure client file uploads to S3 storage buckets.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-post-example.html"
---
# File Upload S3 Presigned Post Policy

## Overview
Routing large file uploads through application servers consumes server bandwidth and memory. S3 presigned POST policies authorize client browsers to upload directly to S3 with strict constraints.

## Operational Workflow

1. **Generate unique S3 object key prefix with tenant isolation (e.g., uploads/{tenant_id}/{uuid}.jpg).**:
   - Generate unique S3 object key prefix with tenant isolation (e.g., uploads/{tenant_id}/{uuid}.jpg).

2. **Build S3 POST policy specifying exact expiration time (e.g., 15 minutes) and acl settings.**:
   - Build S3 POST policy specifying exact expiration time (e.g., 15 minutes) and acl settings.

3. **Enforce conditions**:
   - Enforce conditions: ["content-length-range", 1024, 10485760] (1KB to 10MB) and allowed Content-Type.

4. **Return signed form fields to client browser to execute direct multipart/form-data POST to S3.**:
   - Return signed form fields to client browser to execute direct multipart/form-data POST to S3.

## Recommended Tools & Environments
- S3 Presigned POST
- Direct Upload
- AWS SDK
- Storage Security

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
