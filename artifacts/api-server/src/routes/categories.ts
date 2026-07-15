import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { GetCategoryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      sortOrder: categoriesTable.sortOrder,
      productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .groupBy(categoriesTable.id)
    .orderBy(categoriesTable.sortOrder);

  res.json(rows);
});

router.get("/categories/:id", async (req, res): Promise<void> => {
  const parsed = GetCategoryParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .select({
      id: categoriesTable.id,
      name: categoriesTable.name,
      slug: categoriesTable.slug,
      description: categoriesTable.description,
      imageUrl: categoriesTable.imageUrl,
      sortOrder: categoriesTable.sortOrder,
      productCount: sql<number>`cast(count(${productsTable.id}) as int)`,
    })
    .from(categoriesTable)
    .leftJoin(productsTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(categoriesTable.id, parsed.data.id))
    .groupBy(categoriesTable.id);

  if (!row) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(row);
});

export default router;
