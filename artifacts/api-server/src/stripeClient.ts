import Stripe from "stripe";
import { StripeSync } from "stripe-replit-sync";

interface StripeCredentials {
  secretKey: string;
  publishableKey: string;
  webhookSecret?: string;
}

/**
 * Fetches Stripe credentials.
 *
 * Priority:
 *   1. Replit connectors proxy  (set when the Stripe integration is OAuth-linked)
 *   2. STRIPE_SECRET_KEY / STRIPE_PUBLISHABLE_KEY env vars  (manual fallback)
 *
 * Not cached — tokens can rotate, so call fresh each time.
 */
export async function getStripeCredentials(): Promise<StripeCredentials> {
  // ── 1. Try the Replit connectors proxy ──────────────────────────────────
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
      ? "depl " + process.env.WEB_REPL_RENEWAL
      : null;

  if (hostname && xReplitToken) {
    try {
      const resp = await fetch(
        `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=stripe`,
        {
          headers: { Accept: "application/json", X_REPLIT_TOKEN: xReplitToken },
          signal: AbortSignal.timeout(10_000),
        },
      );

      if (resp.ok) {
        const data = await resp.json() as {
          items?: Array<{ settings?: Record<string, string> }>;
        };
        const settings = data.items?.[0]?.settings;
        if (settings?.secret_key) {
          return {
            secretKey: settings.secret_key,
            publishableKey: settings.publishable_key ?? "",
            webhookSecret: settings.webhook_secret,
          };
        }
      }
    } catch {
      // Fall through to env-var check
    }
  }

  // ── 2. Fall back to explicit environment variables ───────────────────────
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY ?? "";

  if (!secretKey) {
    throw new Error(
      "Stripe credentials not found. " +
        "Add STRIPE_SECRET_KEY (and optionally STRIPE_PUBLISHABLE_KEY) to your " +
        "Replit Secrets, or connect Stripe via the Integrations tab.",
    );
  }

  return { secretKey, publishableKey, webhookSecret: process.env.STRIPE_WEBHOOK_SECRET };
}

/**
 * Returns a fresh authenticated Stripe client.
 * Not cached — fetches credentials on every call so rotated keys are picked up.
 */
export async function getUncachableStripeClient(): Promise<Stripe> {
  const { secretKey } = await getStripeCredentials();
  return new Stripe(secretKey);
}

/**
 * Returns a fresh StripeSync instance for webhook processing and data sync.
 * Not cached — fetches credentials on every call so rotated keys are picked up.
 */
export async function getStripeSync(): Promise<StripeSync> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const { secretKey, webhookSecret } = await getStripeCredentials();
  return new StripeSync({
    poolConfig: { connectionString: databaseUrl },
    stripeSecretKey: secretKey,
    stripeWebhookSecret: webhookSecret ?? "",
  });
}
