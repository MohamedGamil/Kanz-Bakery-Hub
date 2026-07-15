import { pgTable, serial, text, integer, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cateringInquiriesTable = pgTable("catering_inquiries", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  requestType: text("request_type").notNull(),
  eventDate: date("event_date", { mode: "string" }),
  preferredDateTime: text("preferred_date_time"),
  guestCount: integer("guest_count"),
  budgetRange: text("budget_range"),
  selectedProducts: text("selected_products"),
  specialRequirements: text("special_requirements"),
  notes: text("notes"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCateringInquirySchema = createInsertSchema(cateringInquiriesTable).omit({ id: true, status: true, createdAt: true, updatedAt: true });
export type InsertCateringInquiry = z.infer<typeof insertCateringInquirySchema>;
export type CateringInquiry = typeof cateringInquiriesTable.$inferSelect;
