---
name: auth0-universal-login-sso-saml
description: Configures enterprise Single Sign-On (SSO) with Auth0 Universal Login, SAML 2.0, and OIDC federations. Use when allowing enterprise clients to sign in using Okta, Azure AD, or Ping.
license: MIT
metadata:
  author: Community List Maintainers
  version: "1.0.0"
  source: "https://auth0.com/docs/authenticate/single-sign-on"
---
# Auth0 Universal Login Sso Saml

## Overview
Enterprise B2B clients require signing in via their corporate identity provider. Auth0 Universal Login federates enterprise SAML and WS-Federation connections with zero custom SAML XML parsing.

## Operational Workflow

1. **Create Enterprise SAML connection in Auth0 dashboard and exchange IdP metadata XML with client IT.**:
   - Create Enterprise SAML connection in Auth0 dashboard and exchange IdP metadata XML with client IT.

2. **Configure domain-level Home Realm Discovery (HRD) to route corporate email domains to their specific IdP.**:
   - Configure domain-level Home Realm Discovery (HRD) to route corporate email domains to their specific IdP.

3. **Redirect user to Auth0 Universal Login; Auth0 manages SAML handshake and emits signed JWT tokens.**:
   - Redirect user to Auth0 Universal Login; Auth0 manages SAML handshake and emits signed JWT tokens.

4. **Map incoming SAML attributes (groups, department) to application role-based access control (RBAC) scopes.**:
   - Map incoming SAML attributes (groups, department) to application role-based access control (RBAC) scopes.

## Recommended Tools & Environments
- Auth0
- Enterprise SSO
- SAML 2.0 / OIDC
- Identity Federation

## Verification & Execution Criteria
- Pre-execution validation verifies all prerequisites and inputs.
- Step-by-step progress logging confirms intermediate state transitions.
- Post-execution checks verify output integrity and clean exit codes.
