---
name: adversarial-red-teaming-harness
description: Executes automated adversarial jailbreak, prompt injection, and boundary tests against agent conversational interfaces. Use when hardening AI agents against malicious inputs and prompt injection exploits.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://github.com/leondz/garak"
---
# Adversarial Red Teaming Harness

## Overview
LLM agents require systematic red-teaming against prompt injections, system prompt extraction, indirect injection payloads, and goal hijacking before deployment to production environments.

## Operational Workflow

1. **Load standardized vulnerability attack vectors (direct jailbreaks, roleplay bypasses, base64 encodings).**:
   - Load standardized vulnerability attack vectors (direct jailbreaks, roleplay bypasses, base64 encodings).

2. **Inject indirect payloads into test documents and simulated external API responses.**:
   - Inject indirect payloads into test documents and simulated external API responses.

3. **Analyze agent execution traces to verify whether security constraints and system boundaries held.**:
   - Analyze agent execution traces to verify whether security constraints and system boundaries held.

4. **Generate automated vulnerability scorecards highlighting compromised system prompts or bypassed guardrails.**:
   - Generate automated vulnerability scorecards highlighting compromised system prompts or bypassed guardrails.

## Recommended Tools & Environments
- Python 3.11+
- Garak
- OWASP Top 10 LLM
- Pytest

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
