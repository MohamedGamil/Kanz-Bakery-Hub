import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Package, ArrowRight, Home, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

interface OrderItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
}

interface Order {
  id: number;
  customerName: string;
  email: string;
  phone?: string | null;
  items: OrderItem[];
  subtotal: string;
  status: string;
  notes?: string | null;
  createdAt: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function OrderConfirmationPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderId = params.get("orderId");
  const paymentIntentStatus = params.get("redirect_status");
  const { t } = useTranslation();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    document.title = t("orderConfirmation.pageTitle");
  }, [t]);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID found.");
      setLoading(false);
      return;
    }

    if (paymentIntentStatus === "succeeded") {
      clearCart();
    }

    fetch(`${BASE}/api/stripe/orders/${orderId}/verify`, { method: "POST" })
      .then((r) => {
        if (!r.ok) throw new Error("Order not found");
        return r.json();
      })
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [orderId, paymentIntentStatus, clearCart]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">{t("orderConfirmation.loadingOrder")}</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Package className="w-16 h-16 text-muted-foreground" />
        <h1 className="font-serif text-2xl font-bold">{t("orderConfirmation.orderNotFound")}</h1>
        <p className="text-muted-foreground">{error || "Something went wrong."}</p>
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 me-2" /> {t("orderConfirmation.goHome")}
          </Link>
        </Button>
      </div>
    );
  }

  const isPaid = order.status === "paid" || paymentIntentStatus === "succeeded";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-2">
          {isPaid ? t("orderConfirmation.confirmed") : t("orderConfirmation.processing")}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isPaid
            ? t("orderConfirmation.confirmedDesc", { name: order.customerName.split(" ")[0] })
            : t("orderConfirmation.processingDesc")}
        </p>
      </div>

      {/* Order card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm mb-8">
        {/* Meta */}
        <div className="px-6 py-4 bg-muted/30 border-b border-border flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground">{t("orderConfirmation.orderLabel")}</span>{" "}
            <span className="font-semibold">#{order.id}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("orderConfirmation.emailLabel")}</span>{" "}
            <span className="font-medium">{order.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground">{t("orderConfirmation.statusLabel")}</span>{" "}
            <span className={`font-semibold capitalize ${isPaid ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
              {isPaid ? t("orderConfirmation.statusPaid") : order.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 px-6 py-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-accent shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[10px]">Kanz</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground">{t("orderConfirmation.qtyLabel")} {item.quantity}</p>
              </div>
              <span className="font-semibold text-sm shrink-0">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="px-6 py-4 bg-muted/20 border-t border-border flex justify-between items-center">
          <span className="font-semibold">{t("orderConfirmation.totalLabel")}</span>
          <span className="font-bold text-xl text-primary">
            ${Number(order.subtotal).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-accent/40 rounded-xl px-5 py-4 mb-8 text-sm text-foreground">
          <span className="font-medium">{t("orderConfirmation.orderNotes")} </span>
          {order.notes}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/menu">
            {t("orderConfirmation.orderMore")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href="/my-orders">
            <ClipboardList className="w-4 h-4" /> {t("orderConfirmation.viewHistory")}
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link href="/">
            <Home className="w-4 h-4" /> {t("orderConfirmation.goHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
