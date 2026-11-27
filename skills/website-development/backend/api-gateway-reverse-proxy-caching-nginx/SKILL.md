---
name: api-gateway-reverse-proxy-caching-nginx
description: Configures NGINX reverse proxy micro-caching, gzip/brotli compression, and SSL termination. Use when shielding upstream backend application servers and accelerating API response times.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://docs.nginx.com/nginx/admin-guide/content-cache/content-caching/"
---
# Api Gateway Reverse Proxy Caching Nginx

## Overview
Passing all requests directly to Node/Python backends wastes CPU. NGINX micro-caching caches identical GET API responses for 1–5 seconds, absorbing massive viral traffic spikes with near-zero latency.

## Operational Workflow

1. **Define proxy_cache_path in nginx.conf with keys_zone memory allocation and max_size limits.**:
   - Define proxy_cache_path in nginx.conf with keys_zone memory allocation and max_size limits.

2. **Configure proxy_cache with proxy_cache_valid 200 302 5s for short-lived micro-caching.**:
   - Configure proxy_cache with proxy_cache_valid 200 302 5s for short-lived micro-caching.

3. **Set proxy_cache_use_stale updating error timeout to serve cached content while updating in the background.**:
   - Set proxy_cache_use_stale updating error timeout to serve cached content while updating in the background.

4. **Enable brotli/gzip compression and HTTP/2 SSL termination with modern TLS 1.3 ciphers.**:
   - Enable brotli/gzip compression and HTTP/2 SSL termination with modern TLS 1.3 ciphers.

## Recommended Tools & Environments
- NGINX
- Reverse Proxy
- Micro-Caching
- Performance

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
