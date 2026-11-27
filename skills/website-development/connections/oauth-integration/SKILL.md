---
name: oauth-integration
description: Implements OAuth 2.0 and OpenID Connect sign-in correctly for web, native, and machine-to-machine clients, covering PKCE, state and nonce, token storage, refresh rotation, and token validation. Use when adding social or SSO login, debugging a redirect loop or invalid_token error, or reviewing an auth implementation.
license: MIT
metadata:
  author: community-list
  version: "1.0.0"
  created: "2026-11-22"
---

# OAuth Integration

Most OAuth bugs are one of five mistakes. Identify which one you are about to make before writing
code.

## When to use

- Adding "Sign in with…" or enterprise SSO.
- A redirect loop, `invalid_state`, or `invalid_token` error.
- Reviewing token handling in an existing app.
- Adding a machine-to-machine client.

## Step 1 — Choose the flow from the client type

| Client | Flow | Never use |
|--------|------|-----------|
| Server-rendered web app (BFF) | Authorization Code + PKCE, tokens held server-side | Implicit |
| SPA calling APIs directly | Authorization Code + PKCE, tokens in memory | Implicit, ROPC |
| Native mobile/desktop | Authorization Code + PKCE with a loopback or custom-scheme redirect | Embedded webview login |
| Machine-to-machine | Client Credentials | Any user flow |
| CLI on a headless server | Device Authorization Grant | Password grant |

The Implicit flow and the Resource Owner Password grant are deprecated by the OAuth 2.0 Security
Best Current Practice. If a provider only supports them, record that as a risk.

## Step 2 — Get the authorization request right

```
GET /authorize
  ?response_type=code
  &client_id=<id>
  &redirect_uri=<exact registered URI>
  &scope=openid%20profile%20email
  &state=<128-bit random, bound to the user's session>
  &nonce=<128-bit random, for OIDC id_token>
  &code_challenge=<BASE64URL(SHA256(verifier))>
  &code_challenge_method=S256
```

Rules:
- `state` must be generated per request, stored server-side or in a secure cookie, and compared on
  callback. It is CSRF protection for the callback.
- `nonce` must be stored and compared against the `id_token` claim.
- `redirect_uri` must match the registered value **exactly**: no wildcards, no path traversal, no
  open redirect through a `next` parameter.
- PKCE `code_verifier` is 43–128 characters from the unreserved set; store it with the state, then
  discard it after the token exchange.

## Step 3 — Exchange the code server-side

```
POST /token
  grant_type=authorization_code
  code=<code>
  redirect_uri=<same as the authorize request>
  client_id=<id>
  code_verifier=<verifier>
```

- The exchange happens on the server or in the native app, never in a browser page that could leak
  the code.
- Authorization codes are single-use and short-lived. If the exchange fails, restart the flow; do
  not retry the same code.
- Treat the token endpoint response as untrusted input: validate `token_type`, `expires_in`, and
  that the `scope` granted is a subset of what you asked for.

## Step 4 — Store tokens by client type

| Client | Access token | Refresh token |
|--------|--------------|---------------|
| BFF web app | Server session store | Server session store, encrypted at rest |
| SPA | In memory only | Avoid; if unavoidable, use a BFF |
| Native | OS keychain / keystore | OS keychain / keystore |
| M2M | Process memory | N/A |

Never put a refresh token in `localStorage`, `sessionStorage`, a URL, a log, or an analytics event.
Never log an `Authorization` header.

For web, set cookies `HttpOnly; Secure; SameSite=Lax` (or `Strict`), with `__Host-` prefix where
possible.

## Step 5 — Validate tokens, not just decode them

For a JWT access or ID token:

1. Fetch the issuer's JWKS and select the key by `kid`.
2. Verify the signature with an allowlisted algorithm (`RS256`/`ES256`). Reject `none` and reject
   algorithm substitution (an `HS256` token signed with the public key).
3. Verify `iss` equals the expected issuer exactly.
4. Verify `aud` contains your client ID (or the expected API audience).
5. Verify `exp` and `nbf` with a small clock skew (≤60 s).
6. For `id_token`: verify `nonce`, and verify `azp` when multiple audiences are present.
7. Check required scopes for the specific operation, not just "is logged in".

Decoding without verifying is the single most common serious flaw. If a library offers a
`decode` function, do not use it for authorization decisions.

## Step 6 — Handle refresh and revocation

- Refresh proactively, ~60 s before expiry, not after a 401 storm.
- With refresh-token rotation, store the new token atomically; a lost rotated token logs the user
  out.
- Implement reuse detection: if an old refresh token is presented, revoke the whole token family.
- On logout: revoke the refresh token at the provider, clear the session, and clear cookies. A
  client-side "logout" that only deletes a local token leaves a valid session server-side.
- On password change or role change: revoke sessions.

## Step 7 — Verify the implementation

| Test | Expected |
|------|----------|
| Tamper with `state` | Callback rejected, no session created |
| Replay an authorization code | Second exchange rejected |
| Swap `redirect_uri` to an attacker host | Rejected by the provider; if not, your registration is wrong |
| Send `alg: none` token | Rejected |
| Send a token signed by another key | Rejected |
| Expired access token | 401, then one refresh, then retry |
| Reused old refresh token | Family revoked, user logged out |
| Logout, then reuse the access token | Rejected (or short-lived by design, and documented) |

## Rules

- Never implement the Implicit flow for new work.
- Never store client secrets in a SPA, mobile binary, or public repository.
- Never trust a `redirect_uri` from a query parameter without exact matching.
- Never accept a token because it decodes.
- Never put tokens in URLs; they leak through referrers and logs.
- Never build a custom token format when a standard one exists.

## Error handling

| Error | Likely cause | Action |
|-------|--------------|--------|
| `invalid_state` | State not stored, cookie blocked, or multiple tabs | Store state per attempt; allow several concurrent states |
| `redirect_uri_mismatch` | Trailing slash, http vs https, or unregistered path | Match the registered value exactly |
| `invalid_grant` on refresh | Token rotated or revoked | Re-authenticate; do not loop |
| `invalid_token` from the API | Wrong audience, expired, or unverified signature | Check `aud` first, then clock skew, then JWKS freshness |
| Login works, API calls 401 | Token intended for the IdP, not your API | Request the API audience explicitly |

## Example

**Input:** "Add Google sign-in to our Next.js app."
**Output:** Authorization Code + PKCE through a BFF route, `state` and `nonce` bound to an
HttpOnly cookie, tokens server-side only, `aud` verified, refresh with rotation, logout that
revokes, and the eight-row verification table executed.
