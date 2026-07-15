import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, cartSubtotal, cartItemCount } from "@/store/cart";

export default function CartPage() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem } = useCartStore();
  const subtotal = cartSubtotal(items);
  const count = cartItemCount(items);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">{t("cart.emptyTitle")}</h1>
          <p className="text-muted-foreground text-lg">{t("cart.emptyDesc")}</p>
        </div>
        <Button asChild size="lg" className="gap-2">
          <Link href="/menu">
            {t("cart.browseMenu")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      {/* Back link */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href="/menu">
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" /> {t("cart.continueShopping")}
          </Link>
        </Button>
      </div>

      <h1 className="font-serif text-4xl font-bold mb-2">{t("cart.title")}</h1>
      <p className="text-muted-foreground mb-8">
        {t(`cart.itemCount_${count === 1 ? "one" : "other"}`, { count })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-card border border-border rounded-xl shadow-sm"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-accent shrink-0">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs font-medium">
                    Kanz
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      href={`/menu/${item.slug}`}
                      className="font-serif font-semibold text-base hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    {item.categoryName && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.categoryName}</p>
                    )}
                  </div>
                  <span className="font-semibold text-primary shrink-0">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  {/* Qty control */}
                  <div className="flex items-center border border-input rounded-md h-8">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-s-md"
                      aria-label={t("cart.decreaseQty")}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 h-full flex items-center justify-center text-sm font-medium border-x border-input">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-e-md"
                      aria-label={t("cart.increaseQty")}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    aria-label={t("cart.removeItem")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold mb-4">{t("cart.orderSummary")}</h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm gap-2">
                  <span className="text-muted-foreground line-clamp-1 flex-1">
                    {item.name} ×{item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>{t("cart.subtotal")}</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{t("cart.taxesNote")}</p>
            </div>

            <Button size="lg" className="w-full gap-2" onClick={() => navigate("/checkout")}>
              {t("cart.checkout")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {t("cart.secureBadge")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
