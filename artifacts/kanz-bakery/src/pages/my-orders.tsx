import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Search, Package, ShoppingBag, RotateCcw, ChevronDown, ChevronUp, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cart";
import type { CartItem } from "@/store/cart";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
  categoryName?: string;
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

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function StatusBadge({ status, t }: { status: string; t: (k: string) => string }) {
  const colorMap: Record<string, string> = {
    paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  const labelMap: Record<string, string> = {
    paid: t("myOrders.statusPaid"),
    pending: t("myOrders.statusPending"),
    failed: t("myOrders.statusFailed"),
  };
  const cls = colorMap[status] ?? "bg-muted text-muted-foreground";
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${cls}`}>
      {labelMap[status] ?? status}
    </span>
  );
}

function OrderCard({ order, onReorder }: { order: Order; onReorder: (order: Order) => void }) {
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Header row */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-x-4 gap-y-2 bg-muted/30 border-b border-border">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t("myOrders.orderLabel")}</p>
          <p className="font-semibold text-sm">#{order.id}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t("myOrders.dateLabel")}</p>
          <p className="font-medium text-sm">{formatDate(order.createdAt, i18n.language)}</p>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{t("myOrders.totalLabel")}</p>
          <p className="font-bold text-sm text-primary">${Number(order.subtotal).toFixed(2)}</p>
        </div>
        <div>
          <StatusBadge status={order.status} t={t} />
        </div>
      </div>

      {/* Expandable items */}
      <div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>
            {order.items.length} {order.items.length === 1 ? t("myOrders.item") : t("myOrders.items")}
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="divide-y divide-border border-t border-border">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 px-5 py-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[9px]">
                      Kanz
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("myOrders.qtyLabel")} {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-semibold shrink-0">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reorder */}
      <div className="px-5 py-3 border-t border-border flex justify-end">
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => onReorder(order)}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t("myOrders.reorder")}
        </Button>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const { toast } = useToast();

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setOrders(null);

    try {
      const res = await fetch(`${BASE}/api/stripe/orders?email=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || t("myOrders.errorGeneric"));
      }
      const data: Order[] = await res.json();
      setOrders(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("myOrders.errorGeneric"));
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = (order: Order) => {
    clearCart();
    for (const item of order.items) {
      const cartItem: Omit<CartItem, "quantity"> = {
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: Number(item.price),
        imageUrl: item.imageUrl,
        categoryName: item.categoryName,
      };
      addItem(cartItem, item.quantity);
    }
    toast({
      title: t("myOrders.reorderToastTitle"),
      description: t("myOrders.reorderToastDesc"),
    });
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2">{t("myOrders.title")}</h1>
        <p className="text-muted-foreground">{t("myOrders.subtitle")}</p>
      </div>

      {/* Email lookup form */}
      <form onSubmit={handleLookup} className="flex gap-2 mb-8">
        <Input
          type="email"
          placeholder={t("myOrders.emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="gap-2 shrink-0">
          {loading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          {t("myOrders.lookupBtn")}
        </Button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {/* No results */}
      {orders !== null && orders.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Package className="w-16 h-16 text-muted-foreground/40" />
          <p className="font-semibold text-lg">{t("myOrders.noOrders")}</p>
          <p className="text-muted-foreground text-sm">{t("myOrders.noOrdersDesc")}</p>
          <Button asChild variant="outline" className="gap-2 mt-2">
            <Link href="/menu">
              <ShoppingBag className="w-4 h-4" /> {t("myOrders.browseMenu")}
            </Link>
          </Button>
        </div>
      )}

      {/* Orders list — newest first */}
      {orders !== null && orders.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {orders.length === 1
              ? t("myOrders.foundOne")
              : t("myOrders.foundMany", { count: orders.length })}
          </p>
          {[...orders].reverse().map((order) => (
            <OrderCard key={order.id} order={order} onReorder={handleReorder} />
          ))}
        </div>
      )}

      {/* Home link when no search yet */}
      {orders === null && !loading && !error && (
        <div className="flex justify-center mt-4">
          <Button asChild variant="ghost" size="sm" className="gap-2 text-muted-foreground">
            <Link href="/">
              <Home className="w-4 h-4" /> {t("myOrders.backHome")}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
