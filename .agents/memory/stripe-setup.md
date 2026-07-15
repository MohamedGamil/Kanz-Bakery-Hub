---
name: Stripe setup pattern
description: How Stripe credentials and migrations work in this project — key gotchas discovered during setup.
---

## Credential delivery

The Replit Stripe connector (`ccfg_stripe_...`) does NOT deliver credentials through the connectors proxy (`/api/v2/connection`) in development — the proxy returns `{"items":[]}` even after `ProposeIntegration` is accepted.

**Working approach:** `stripeClient.ts` falls back to `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` env secrets, set via `requestSecrets`. The connectors path is attempted first; if it returns nothing, env vars are used.

## stripe-replit-sync migration timing

`runMigrations({ databaseUrl })` is idempotent but on the **very first** run with real credentials, it runs ~52 migrations that take several seconds. If the API server starts and immediately calls `findOrCreateManagedWebhook` before migrations finish, it throws `relation "stripe.accounts" does not exist`. Fix: restart the server once after the first migration run completes — it will start clean on the second boot.

**Why:** The `runMigrations` call in `initStripe()` is awaited, but the first run with new API keys triggers Stripe account lookup (migrations 43–52) which takes ~5 seconds of Stripe API calls. Previously migrations had been run with no credentials so those later migrations never ran.

## How to apply

- Any new deployment / fresh DB: expect one failed startup → restart resolves it.
- Never remove the `runMigrations` call; it's idempotent and safe every startup.
- The `syncBackfill()` call is fire-and-forget (`.catch(...)`) — don't await it at startup.
