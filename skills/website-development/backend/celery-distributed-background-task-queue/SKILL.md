---
name: celery-distributed-background-task-queue
description: Orchestrates asynchronous distributed background job queues and worker retries using Celery and Redis. Use when executing heavy video encoding, report generation, and email jobs off the web thread.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.celeryq.dev/"
---
# Celery Distributed Background Task Queue

## Overview
Long-running tasks block web request threads. Celery offloads work to asynchronous background worker processes, handling task retries with exponential backoff, rate limits, and scheduling.

## Operational Workflow

1. **Initialize Celery application with broker URL (Redis or RabbitMQ) and result backend.**:
   - Initialize Celery application with broker URL (Redis or RabbitMQ) and result backend.

2. **Decorate background processing functions with @app.task(bind=True, max_retries=3).**:
   - Decorate background processing functions with @app.task(bind=True, max_retries=3).

3. **Trigger asynchronous tasks from web request handlers using task.delay(*args) and return 202 Accepted.**:
   - Trigger asynchronous tasks from web request handlers using task.delay(*args) and return 202 Accepted.

4. **Configure Celery Beat daemon to run recurring scheduled cron jobs (e.g., nightly database backups).**:
   - Configure Celery Beat daemon to run recurring scheduled cron jobs (e.g., nightly database backups).

## Recommended Tools & Environments
- Celery
- Redis / RabbitMQ
- Background Workers
- Python

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
