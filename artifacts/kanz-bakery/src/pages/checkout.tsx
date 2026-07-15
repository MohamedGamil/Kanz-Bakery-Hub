import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ChevronLeft, ShoppingBag, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCartStore, cartSubtotal } from "@/store/cart";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

// ─── Customer form schema ───────────────────────────────────────────────────
const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
type CustomerValues = z.infer<typeof customerSchema>;

// ─── Inner payment form (rendered inside <Elements>) ─────────────────────────
function PaymentForm({
  orderId,
  onBack,
}: {
  orderId: number;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setPaymentError(null);

    const returnUrl = `${window.location.origin}${BASE}/order-confirmation?orderId=${orderId}`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl },
    });

    // confirmPayment only returns here if there's an immediate error
    if (error) {
      setPaymentError(error.message ?? "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: "tabs",
          fields: { billingDetails: { name: "auto", email: "auto" } },
        }}
      />

      {paymentError && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm">
          {paymentError}
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="gap-1"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || isSubmitting}
          className="flex-1 gap-2"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" /> Place Order
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Secured by Stripe. Your card details are never stored on our servers.
      </p>
    </form>
  );
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { items } = useCartStore();
  const subtotal = cartSubtotal(items);

  const [step, setStep] = useState<"details" | "payment">("details");
  const [stripePromise, setStripePromise] = useState<ReturnType<typeof loadStripe> | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CustomerValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "", notes: "" },
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) navigate("/cart");
  }, [items.length, navigate]);

  // Load publishable key once
  useEffect(() => {
    fetch(`${BASE}/api/stripe/config`)
      .then((r) => r.json())
      .then(({ publishableKey }) => {
        if (publishableKey) setStripePromise(loadStripe(publishableKey));
      })
      .catch(() => {
        setServerError("Unable to load payment configuration. Please try again.");
      });
  }, []);

  const handleDetailsSubmit = async (values: CustomerValues) => {
    setIsCreatingIntent(true);
    setServerError(null);

    try {
      const res = await fetch(`${BASE}/api/stripe/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            slug: i.slug,
            imageUrl: i.imageUrl,
            categoryName: i.categoryName,
          })),
          customer: values,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create order");

      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setStep("payment");
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground">
          <Link href="/cart">
            <ChevronLeft className="w-4 h-4" /> Back to bag
          </Link>
        </Button>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "details" ? "text-primary" : "text-muted-foreground"}`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            1
          </span>
          Your details
        </div>
        <div className="flex-1 h-px bg-border" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step === "payment" ? "text-primary" : "text-muted-foreground"}`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "payment" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            2
          </span>
          Payment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-3">
          {step === "details" && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6">Contact details</h2>
              <form
                onSubmit={form.handleSubmit(handleDetailsSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name *</Label>
                    <Input
                      id="name"
                      placeholder="Sara Al-Hashimi"
                      {...form.register("name")}
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971 50 000 0000"
                      {...form.register("phone")}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="sara@example.com"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes">Order notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Allergies, special requests, pickup time preference…"
                    rows={3}
                    {...form.register("notes")}
                  />
                </div>

                {serverError && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-lg px-4 py-3 text-sm">
                    {serverError}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isCreatingIntent}
                >
                  {isCreatingIntent ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                      Preparing your order…
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </form>
            </div>
          )}

          {step === "payment" && clientSecret && stripePromise && orderId !== null && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="font-serif text-2xl font-bold mb-6">Payment</h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: "stripe",
                    variables: {
                      colorPrimary: "#b5852a",
                      colorBackground: "#fefcf8",
                      borderRadius: "8px",
                      fontFamily: "DM Sans, sans-serif",
                    },
                  },
                }}
              >
                <PaymentForm
                  orderId={orderId}
                  onBack={() => setStep("details")}
                />
              </Elements>
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Order summary
            </h3>

            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden bg-accent shrink-0">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-[8px]">
                        Kanz
                      </div>
                    )}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 text-sm line-clamp-1">{item.name}</span>
                  <span className="text-sm font-medium shrink-0">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
