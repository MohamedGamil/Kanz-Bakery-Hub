import { Router, type IRouter } from "express";
import { eq, inArray } from "drizzle-orm";
import { db, productsTable, ordersTable } from "@workspace/db";
import { getUncachableStripeClient, getStripeCredentials } from "../stripeClient";

const router: IRouter = Router();

// Return publishable key for frontend Stripe.js initialisation
router.get("/stripe/config", async (_req, res): Promise<void> => {
  try {
    const creds = await getStripeCredentials();
    res.json({ publishableKey: creds.publishableKey });
  } catch (err) {
    res.status(503).json({ error: "Stripe not configured" });
  }
});

// Create a PaymentIntent from validated cart items
router.post("/stripe/create-payment-intent", async (req, res): Promise<void> => {
  const { items, customer } = req.body as {
    items: Array<{ productId: number; quantity: number; slug?: string; imageUrl?: string | null; categoryName?: string }>;
    customer: { name: string; email: string; phone?: string; notes?: string };
  };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  if (!customer?.name?.trim() || !customer?.email?.trim()) {
    res.status(400).json({ error: "Name and email are required" });
    return;
  }
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(customer.email)) {
    res.status(400).json({ error: "Invalid email address" });
    return;
  }

  // Fetch prices from DB — never trust amounts from the client
  const productIds = items.map((i) => i.productId);
  const dbProducts = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      price: productsTable.price,
      available: productsTable.available,
      imageUrl: productsTable.imageUrl,
    })
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const validatedItems: Array<{
    productId: number;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    categoryName?: string;
  }> = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    if (!product.available) {
      res.status(400).json({ error: `"${product.name}" is currently sold out` });
      return;
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      res.status(400).json({ error: "Invalid quantity" });
      return;
    }
    const unitPrice = Number(product.price);
    validatedItems.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: unitPrice,
      quantity: item.quantity,
      imageUrl: product.imageUrl,
      categoryName: item.categoryName,
    });
    subtotal += unitPrice * item.quantity;
  }

  const subtotalCents = Math.round(subtotal * 100);

  // Persist order with status = "pending"
  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName: customer.name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone?.trim() || null,
      items: validatedItems,
      subtotal: subtotal.toFixed(2),
      status: "pending",
      notes: customer.notes?.trim() || null,
    })
    .returning();

  // Create Stripe PaymentIntent
  const stripe = await getUncachableStripeClient();
  const pi = await stripe.paymentIntents.create({
    amount: subtotalCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: { orderId: String(order.id) },
    description: `Kanz Bakery order #${order.id} — ${customer.name}`,
    receipt_email: customer.email,
  });

  // Store the PaymentIntent ID on the order
  await db
    .update(ordersTable)
    .set({ stripePaymentIntentId: pi.id, updatedAt: new Date() })
    .where(eq(ordersTable.id, order.id));

  res.json({ clientSecret: pi.client_secret, orderId: order.id });
});

// Get a single order (used by confirmation page)
router.get("/stripe/orders/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  });
});

// Verify payment status after Stripe redirect and reconcile order status.
// Called by the confirmation page with the payment_intent id from the URL.
router.post("/stripe/orders/:id/verify", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // Fetch live PI status from Stripe
  if (order.stripePaymentIntentId) {
    try {
      const stripe = await getUncachableStripeClient();
      const pi = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);

      const newStatus =
        pi.status === "succeeded"
          ? "paid"
          : pi.status === "canceled" || pi.status === "requires_payment_method"
            ? "failed"
            : order.status;

      if (newStatus !== order.status) {
        await db
          .update(ordersTable)
          .set({ status: newStatus, updatedAt: new Date() })
          .where(eq(ordersTable.id, id));
        order.status = newStatus;
      }
    } catch {
      // Non-fatal — return order with existing status
    }
  }

  res.json({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  });
});

export default router;
