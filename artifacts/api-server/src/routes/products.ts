import { Router, type IRouter } from "express";
import { eq, ilike, and, sql, asc, type SQL } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { GetProductParams, GetProductBySlugParams, ListProductsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

// Helper to compute average rating and review count via subquery
const productWithStats = () =>
  db
    .select({
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
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .groupBy(productsTable.id, categoriesTable.name);

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, search, featured, available = true, page = 1, limit = 20 } = parsed.data;
  const offset = (page - 1) * limit;

  // Always filter by available; defaults to true so unavailable products never appear in listings
  const conditions: SQL[] = [eq(productsTable.available, available)];
  if (categoryId != null) conditions.push(eq(productsTable.categoryId, categoryId));
  if (featured != null) conditions.push(eq(productsTable.featured, featured));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));

  const baseQuery = productWithStats();
  const query = conditions.length > 0
    ? baseQuery.where(and(...conditions))
    : baseQuery;

  const allItems = await query.orderBy(asc(productsTable.name));

  const total = allItems.length;
  const items = allItems.slice(offset, offset + limit);

  res.json({ items, total, page, limit });
});

router.get("/products/slug/:slug", async (req, res): Promise<void> => {
  const parsed = GetProductBySlugParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      shortDescription: productsTable.shortDescription,
      price: sql<number>`cast(${productsTable.price} as float)`,
      imageUrl: productsTable.imageUrl,
      images: sql<string[]>`array[${productsTable.imageUrl}]::text[]`,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      ingredients: productsTable.ingredients,
      allergens: productsTable.allergens,
      dietaryLabels: productsTable.dietaryLabels,
      available: productsTable.available,
      featured: productsTable.featured,
      averageRating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)`,
      reviewCount: sql<number>`cast(count(${reviewsTable.id}) as int)`,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .where(eq(productsTable.slug, parsed.data.slug))
    .groupBy(productsTable.id, categoriesTable.name);

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(row);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetProductParams.safeParse({ id: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      shortDescription: productsTable.shortDescription,
      price: sql<number>`cast(${productsTable.price} as float)`,
      imageUrl: productsTable.imageUrl,
      images: sql<string[]>`array[${productsTable.imageUrl}]::text[]`,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      ingredients: productsTable.ingredients,
      allergens: productsTable.allergens,
      dietaryLabels: productsTable.dietaryLabels,
      available: productsTable.available,
      featured: productsTable.featured,
      averageRating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)`,
      reviewCount: sql<number>`cast(count(${reviewsTable.id}) as int)`,
    })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(categoriesTable.id, productsTable.categoryId))
    .leftJoin(reviewsTable, and(eq(reviewsTable.productId, productsTable.id), eq(reviewsTable.approved, true)))
    .where(eq(productsTable.id, parsed.data.id))
    .groupBy(productsTable.id, categoriesTable.name);

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(row);
});

export default router;
