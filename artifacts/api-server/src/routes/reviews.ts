import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "@workspace/db";
import { ListReviewsQueryParams, CreateReviewBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const parsed = ListReviewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, page = 1, limit = 10 } = parsed.data;
  const offset = (page - 1) * limit;

  const allRows = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, productId))
    .orderBy(desc(reviewsTable.createdAt));

  const total = allRows.length;
  const items = allRows.slice(offset, offset + limit).map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  res.json({ items, total, page, limit });
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { productId, rating, reviewerName, comment } = parsed.data;

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be between 1 and 5" });
    return;
  }

  // Check product exists
  const [product] = await db
    .select({ id: productsTable.id })
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({ productId, rating, reviewerName: reviewerName ?? null, comment: comment ?? null })
    .returning();

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
