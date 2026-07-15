/**
 * CLI entry point for the seed script.
 * Runs the seed and then closes the shared pool (safe here since this is a one-shot process).
 * Invoked via:  pnpm --filter @workspace/api-server seed
 */
import { pool } from "@workspace/db";
import { runSeed } from "./seed";

runSeed()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
