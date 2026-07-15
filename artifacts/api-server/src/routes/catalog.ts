import { Router, type IRouter } from "express";
import { eq, desc, sql, and } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { GetTopRatedProductsQueryParams, SearchProductsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

const productListSelect = () => ({
  id: productsTable.id,
  name: productsTable.name,
  slug: productsTable.slug,
  shortDescription: productsTable.shortDescription,
  price: sql<number>`cast(${productsTable.price} as float)`,
  imageUrl: productsTable.imageUrl,
  categoryId: productsTable.categoryId,
  categoryName: categoriesTable.name,
  available: productsTable.available,
  featured: productsTable.featured,
  dietaryLabels: productsTable.dietaryLabels,
  averageRating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)`,
  reviewCount: sql<number>`cast(count(${reviewsTable.id}) as int)`,
});

router.get("/catalog/featured", async (_req, res): Promise<void> => {
  const items = await db
    .select(productListSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .where(and(eq(productsTable.featured, true), eq(productsTable.available, true)))
    .groupBy(productsTable.id, categoriesTable.name)
    .orderBy(productsTable.id)
    .limit(8);

  res.json(items);
});

router.get("/catalog/stats", async (_req, res): Promise<void> => {
  const [productStats] = await db
    .select({
      totalProducts: sql<number>`cast(count(*) as int)`,
    })
    .from(productsTable);

  const [categoryStats] = await db
    .select({
      totalCategories: sql<number>`cast(count(*) as int)`,
    })
    .from(categoriesTable);

  const [reviewStats] = await db
    .select({
      totalReviews: sql<number>`cast(count(*) as int)`,
      averageRating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.approved, true));

  res.json({
    totalProducts: productStats?.totalProducts ?? 0,
    totalCategories: categoryStats?.totalCategories ?? 0,
    totalReviews: reviewStats?.totalReviews ?? 0,
    averageRating: parseFloat(parseFloat(String(reviewStats?.averageRating ?? 0)).toFixed(1)),
  });
});

router.get("/catalog/top-rated", async (req, res): Promise<void> => {
  const parsed = GetTopRatedProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const limit = parsed.data.limit ?? 6;

  const items = await db
    .select(productListSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .where(eq(productsTable.available, true))
    .groupBy(productsTable.id, categoriesTable.name)
    .orderBy(desc(sql`avg(${reviewsTable.rating})`))
    .limit(limit);

  res.json(items);
});

router.get("/catalog/search", async (req, res): Promise<void> => {
  const parsed = SearchProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q } = parsed.data;
  const pattern = `%${q}%`;

  const items = await db
    .select(productListSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .where(
      sql`(${productsTable.name} ilike ${pattern} or ${productsTable.description} ilike ${pattern} or ${productsTable.shortDescription} ilike ${pattern})`
    )
    .groupBy(productsTable.id, categoriesTable.name)
    .limit(20);

  res.json(items);
});

export default router;
