import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { WebhookHandlers } from "./webhookHandlers";
import { runSeed } from "./seed";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Stripe webhook MUST be registered BEFORE express.json() — needs raw Buffer
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res): Promise<void> => {
    const signature = req.headers["stripe-signature"];
    if (!signature) {
      res.status(400).json({ error: "Missing stripe-signature" });
      return;
    }
    try {
      const sig = Array.isArray(signature) ? signature[0] : signature;
      await WebhookHandlers.processWebhook(req.body as Buffer, sig);
      res.status(200).json({ received: true });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      logger.error({ err: error }, "Stripe webhook error");
      res.status(400).json({ error: msg });
    }
  },
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// One-time admin seed endpoint — protected by ADMIN_SEED_TOKEN env var
app.post("/api/admin/seed", express.json(), async (req, res): Promise<void> => {
  const token = process.env.ADMIN_SEED_TOKEN;
  if (!token || req.headers["x-seed-token"] !== token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    await runSeed();
    res.json({ ok: true, message: "Seed complete" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err }, "Seed failed");
    res.status(500).json({ error: msg });
  }
});

export default app;
