import {
  pgTable,
  serial,
  text,
  numeric,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export interface OrderItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  categoryName?: string;
}

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending | paid | failed
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
