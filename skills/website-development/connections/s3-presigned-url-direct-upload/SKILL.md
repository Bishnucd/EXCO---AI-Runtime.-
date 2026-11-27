---
name: s3-presigned-url-direct-upload
description: Generates secure AWS S3 presigned PUT URLs for direct browser-to-storage client file uploads. Use when uploading large files without routing gigabytes through backend application servers.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html"
---
# S3 Presigned Url Direct Upload

## Overview
Routing large file uploads (videos, high-res images) through backend servers wastes bandwidth and blocks threads. Presigned URLs allow clients to upload directly to S3 with strict size and type limits.

## Operational Workflow

1. **Validate user upload permissions, target file name, and declared MIME content type.**:
   - Validate user upload permissions, target file name, and declared MIME content type.

2. **Generate S3 presigned PUT URL using AWS SDK with a 5-minute expiration window.**:
   - Generate S3 presigned PUT URL using AWS SDK with a 5-minute expiration window.

3. **Return presigned URL and unique S3 object key to frontend client application.**:
   - Return presigned URL and unique S3 object key to frontend client application.

4. **Frontend uploads binary file directly to S3 via HTTP PUT, notifying backend upon completion.**:
   - Frontend uploads binary file directly to S3 via HTTP PUT, notifying backend upon completion.

## Recommended Tools & Environments
- AWS S3
- AWS SDK v3
- Node.js / Python
- CORS

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
