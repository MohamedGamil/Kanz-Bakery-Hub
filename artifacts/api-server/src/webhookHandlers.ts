import { getStripeSync } from "./stripeClient";

/**
 * Thin wrapper — stripe-replit-sync handles all DB syncing internally.
 * Order status is reconciled by the /stripe/orders/:id/verify endpoint
 * which the confirmation page calls after Stripe's redirect.
 */
export class WebhookHandlers {
  static async processWebhook(
    payload: Buffer,
    signature: string,
  ): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        "STRIPE WEBHOOK ERROR: Payload must be a Buffer. " +
          "Ensure the webhook route is registered BEFORE app.use(express.json()).",
      );
    }
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);
  }
}
