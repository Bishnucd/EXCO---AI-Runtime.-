---
name: nextjs-server-actions-data-mutation
description: Implements type-safe data mutations and progressive enhancement using Next.js App Router Server Actions. Use when building interactive web forms with server-side validation and revalidation.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations"
---
# Nextjs Server Actions Data Mutation

## Overview
Server Actions allow frontend components to invoke asynchronous server functions directly without authoring boilerplate API routes. Integrated cache revalidation updates UI states automatically.

## Operational Workflow

1. **Declare asynchronous server action marked with use server directive.**:
   - Declare asynchronous server action marked with use server directive.

2. **Parse and validate inbound FormData payloads against strict Zod validation schemas.**:
   - Parse and validate inbound FormData payloads against strict Zod validation schemas.

3. **Perform database mutation inside authenticated server context.**:
   - Perform database mutation inside authenticated server context.

4. **Trigger revalidatePath() or revalidateTag() to purge cached data and refresh client UI.**:
   - Trigger revalidatePath() or revalidateTag() to purge cached data and refresh client UI.

## Recommended Tools & Environments
- Next.js 14/15
- React Server Components
- Zod
- TypeScript

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
