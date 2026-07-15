import { Router } from "express";
import { runSeed } from "../seed";
import { logger } from "../lib/logger";

const adminRouter = Router();

/**
 * POST /api/admin/seed
 * Protected by ADMIN_SEED_TOKEN secret. Runs the full idempotent seed against
 * the current database (dev or prod depending on environment).
 *
 * Rotate the token by updating the ADMIN_SEED_TOKEN secret — no code change needed.
 */
adminRouter.post("/admin/seed", async (req, res): Promise<void> => {
  const token = process.env.ADMIN_SEED_TOKEN;
  if (!token || req.headers["x-seed-token"] !== token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    await runSeed();
    res.json({ ok: true, message: "Seed complete — 6 categories, 24 products" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    logger.error({ err }, "Seed failed");
    res.status(500).json({ error: msg });
  }
});

export default adminRouter;
