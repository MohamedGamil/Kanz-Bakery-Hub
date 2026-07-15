import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, cateringInquiriesTable } from "@workspace/db";
import { ListCateringInquiriesQueryParams, CreateCateringInquiryBody, GetCateringInquiryParams } from "@workspace/api-zod";

const VALID_REQUEST_TYPES = ["bulk", "catering", "corporate", "wedding", "party", "other"] as const;

const router: IRouter = Router();

router.get("/catering-inquiries", async (req, res): Promise<void> => {
  const parsed = ListCateringInquiriesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { page = 1, limit = 20 } = parsed.data;
  const offset = (page - 1) * limit;

  const allRows = await db
    .select()
    .from(cateringInquiriesTable)
    .orderBy(cateringInquiriesTable.createdAt);

  const total = allRows.length;
  const items = allRows.slice(offset, offset + limit).map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  res.json({ items, total, page, limit });
});

router.post("/catering-inquiries", async (req, res): Promise<void> => {
  const parsed = CreateCateringInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  // Validate event date is not in the past
  if (data.eventDate) {
    const today = new Date().toISOString().slice(0, 10);
    if (data.eventDate < today) {
      res.status(400).json({ error: "Event date cannot be in the past" });
      return;
    }
  }

  const [inquiry] = await db
    .insert(cateringInquiriesTable)
    .values({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone ?? null,
      requestType: data.requestType,
      eventDate: data.eventDate ?? null,
      preferredDateTime: data.preferredDateTime ?? null,
      guestCount: data.guestCount ?? null,
      budgetRange: data.budgetRange ?? null,
      selectedProducts: data.selectedProducts ?? null,
      specialRequirements: data.specialRequirements ?? null,
      notes: data.notes ?? null,
    })
    .returning();

  res.status(201).json({ ...inquiry, createdAt: inquiry.createdAt.toISOString(), updatedAt: inquiry.updatedAt.toISOString() });
});

router.get("/catering-inquiries/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetCateringInquiryParams.safeParse({ id: raw });
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [inquiry] = await db
    .select()
    .from(cateringInquiriesTable)
    .where(eq(cateringInquiriesTable.id, parsed.data.id));

  if (!inquiry) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }

  res.json({ ...inquiry, createdAt: inquiry.createdAt.toISOString(), updatedAt: inquiry.updatedAt.toISOString() });
});

export default router;
